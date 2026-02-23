import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type FuelType = { #petrol; #diesel };
  type PaymentMethod = { #cash; #card; #upi; #wallet };
  module FuelType {
    public func equal(ft1 : FuelType, ft2 : FuelType) : Bool {
      ft1 == ft2;
    };
  };

  type Sale = {
    id : Nat;
    timestamp : Time.Time;
    fuelType : FuelType;
    quantity : Float;
    totalAmount : Float;
    paymentMethod : PaymentMethod;
    employee : Principal;
    branch : Text;
  };

  module Sale {
    public func compare(sale1 : Sale, sale2 : Sale) : Order.Order {
      Nat.compare(sale1.id, sale2.id);
    };
  };

  type Branch = {
    id : Text;
    name : Text;
    location : Text;
    petrolStock : Float;
    dieselStock : Float;
    petrolPrice : Float;
    dieselPrice : Float;
    lowStockThreshold : Float;
  };

  module Branch {
    public func compare(branch1 : Branch, branch2 : Branch) : Order.Order {
      Text.compare(branch1.id, branch2.id);
    };
  };

  public type FuelStockLevel = {
    petrol : Float;
    diesel : Float;
  };

  type Employee = {
    id : Text;
    name : Text;
    role : Text;
    branch : Text;
  };

  module Employee {
    public func compare(employee1 : Employee, employee2 : Employee) : Order.Order {
      Text.compare(employee1.id, employee2.id);
    };
  };

  // Loyalty program types
  type LoyaltyPointTransaction = {
    id : Nat;
    timestamp : Time.Time;
    points : Nat;
    saleId : ?Nat;
    reason : Text;
    employee : Principal;
  };

  module LoyaltyPointTransaction {
    public func compare(tx1 : LoyaltyPointTransaction, tx2 : LoyaltyPointTransaction) : Order.Order {
      Nat.compare(tx1.id, tx2.id);
    };
  };

  type LoyaltyMember = {
    id : Text;
    name : Text;
    phone : Text;
    totalPoints : Nat;
  };

  module LoyaltyMember {
    public func compare(member1 : LoyaltyMember, member2 : LoyaltyMember) : Order.Order {
      Text.compare(member1.id, member2.id);
    };
  };

  type Prebooking = {
    id : Nat;
    timestamp : Time.Time;
    customerName : Text;
    contactNumber : Text;
    fuelType : FuelType;
    quantity : Float;
    requiredDeliveryDate : Time.Time;
    status : Text;
  };

  module Prebooking {
    public func compare(prebooking1 : Prebooking, prebooking2 : Prebooking) : Order.Order {
      Nat.compare(prebooking1.id, prebooking2.id);
    };
  };

  public type UserProfile = {
    name : Text;
    employeeId : ?Text;
    branch : ?Text;
  };

  // State variables
  var nextSaleId = 1;
  var nextLoyaltyId = 1;
  var nextPrebookingId = 1;

  let branches = Map.empty<Text, Branch>();
  let employees = Map.empty<Text, Employee>();
  let sales = Map.empty<Nat, Sale>();
  let loyaltyMembers = Map.empty<Text, LoyaltyMember>();
  let loyaltyPointTransactions = Map.empty<Text, List.List<LoyaltyPointTransaction>>();
  let prebookings = Map.empty<Nat, Prebooking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  let gstRate = 0.18;
  let loyaltyPointsPerCurrency = 1;
  let loyaltyPointsValue = 0.05;
  let lowStockAlertThreshold = 10.0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createBranch(id : Text, name : Text, location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create branches");
    };
    if (branches.containsKey(id)) {
      Runtime.trap("Branch already exists");
    };
    let branch : Branch = {
      id;
      name;
      location;
      petrolStock = 0.0;
      dieselStock = 0.0;
      petrolPrice = 0.0;
      dieselPrice = 0.0;
      lowStockThreshold = 1000.0;
    };
    branches.add(id, branch);
  };

  public shared ({ caller }) func updateBranchStock(branchId : Text, petrolStock : Float, dieselStock : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update stock");
    };
    switch (branches.get(branchId)) {
      case (null) { Runtime.trap("Branch not found") };
      case (?branch) {
        let updatedBranch : Branch = {
          id = branch.id;
          name = branch.name;
          location = branch.location;
          petrolStock;
          dieselStock;
          petrolPrice = branch.petrolPrice;
          dieselPrice = branch.dieselPrice;
          lowStockThreshold = branch.lowStockThreshold;
        };
        branches.add(branchId, updatedBranch);
      };
    };
  };

  public query ({ caller }) func getBranchStockLevels(branchId : Text) : async FuelStockLevel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stock levels");
    };
    switch (branches.get(branchId)) {
      case (null) { Runtime.trap("Branch not found") };
      case (?branch) {
        {
          petrol = branch.petrolStock;
          diesel = branch.dieselStock;
        };
      };
    };
  };

  public shared ({ caller }) func updateFuelPrices(branchId : Text, petrolPrice : Float, dieselPrice : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update prices");
    };
    switch (branches.get(branchId)) {
      case (null) { Runtime.trap("Branch not found") };
      case (?branch) {
        let updatedBranch : Branch = {
          id = branch.id;
          name = branch.name;
          location = branch.location;
          petrolStock = branch.petrolStock;
          dieselStock = branch.dieselStock;
          petrolPrice;
          dieselPrice;
          lowStockThreshold = branch.lowStockThreshold;
        };
        branches.add(branchId, updatedBranch);
      };
    };
  };

  public shared ({ caller }) func recordSale(branchId : Text, fuelType : FuelType, quantity : Float, paymentMethod : PaymentMethod) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can record sales");
    };

    let saleId = nextSaleId;
    switch (branches.get(branchId)) {
      case (null) { Runtime.trap("Branch not found") };
      case (?branch) {
        if (fuelType == #petrol and branch.petrolStock < quantity) {
          Runtime.trap("Insufficient petrol stock");
        };
        if (fuelType == #diesel and branch.dieselStock < quantity) {
          Runtime.trap("Insufficient diesel stock");
        };

        let price = switch (fuelType) {
          case (#petrol) { branch.petrolPrice };
          case (#diesel) { branch.dieselPrice };
        };
        let totalAmount = price * quantity;

        let sale : Sale = {
          id = saleId;
          timestamp = Time.now();
          fuelType;
          quantity;
          totalAmount;
          paymentMethod;
          employee = caller;
          branch = branchId;
        };

        let updatedBranch : Branch = {
          id = branch.id;
          name = branch.name;
          location = branch.location;
          petrolStock = if (fuelType == #petrol) { branch.petrolStock - quantity } else {
            branch.petrolStock;
          };
          dieselStock = if (fuelType == #diesel) { branch.dieselStock - quantity } else {
            branch.dieselStock;
          };
          petrolPrice = branch.petrolPrice;
          dieselPrice = branch.dieselPrice;
          lowStockThreshold = branch.lowStockThreshold;
        };

        branches.add(branchId, updatedBranch);
        sales.add(saleId, sale);

        nextSaleId += 1;

        saleId;
      };
    };
  };

  public shared ({ caller }) func registerLoyaltyMember(name : Text, phone : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can register loyalty members");
    };
    let memberId = "LOY" # nextLoyaltyId.toText();
    let member : LoyaltyMember = {
      id = memberId;
      name;
      phone;
      totalPoints = 0;
    };
    loyaltyMembers.add(memberId, member);
    nextLoyaltyId += 1;
    memberId;
  };

  public shared ({ caller }) func addLoyaltyPoints(memberId : Text, points : Nat, reason : Text, saleId : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can add loyalty points");
    };
    switch (loyaltyMembers.get(memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) {
        let transaction : LoyaltyPointTransaction = {
          id = nextSaleId;
          timestamp = Time.now();
          points;
          saleId;
          reason;
          employee = caller;
        };

        let updatedTransactions = switch (loyaltyPointTransactions.get(memberId)) {
          case (null) {
            List.fromArray<LoyaltyPointTransaction>([transaction]);
          };
          case (?existing) {
            existing.add(transaction);
            existing;
          };
        };

        let updatedMember : LoyaltyMember = {
          id = member.id;
          name = member.name;
          phone = member.phone;
          totalPoints = member.totalPoints + points;
        };

        if (points != 0) { loyaltyMembers.add(memberId, updatedMember) };
        loyaltyPointTransactions.add(memberId, updatedTransactions);
      };
    };
  };

  public query ({ caller }) func getLoyaltyPointTransactions(memberId : Text) : async [LoyaltyPointTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view loyalty transactions");
    };
    switch (loyaltyPointTransactions.get(memberId)) {
      case (null) { [] };
      case (?transactions) {
        transactions.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func createPrebooking(customerName : Text, contactNumber : Text, fuelType : FuelType, quantity : Float, requiredDeliveryDate : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can create prebookings");
    };
    let prebookingId = nextPrebookingId;
    let prebooking : Prebooking = {
      id = prebookingId;
      timestamp = Time.now();
      customerName;
      contactNumber;
      fuelType;
      quantity;
      requiredDeliveryDate;
      status = "pending";
    };
    prebookings.add(prebookingId, prebooking);
    nextPrebookingId += 1;
    prebookingId;
  };

  public shared ({ caller }) func updatePrebookingStatus(prebookingId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can update prebooking status");
    };
    switch (prebookings.get(prebookingId)) {
      case (null) { Runtime.trap("Prebooking not found") };
      case (?prebooking) {
        let updatedPrebooking : Prebooking = {
          id = prebooking.id;
          timestamp = prebooking.timestamp;
          customerName = prebooking.customerName;
          contactNumber = prebooking.contactNumber;
          fuelType = prebooking.fuelType;
          quantity = prebooking.quantity;
          requiredDeliveryDate = prebooking.requiredDeliveryDate;
          status;
        };
        prebookings.add(prebookingId, updatedPrebooking);
      };
    };
  };

  public shared ({ caller }) func createEmployee(id : Text, name : Text, role : Text, branch : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage employees");
    };
    if (employees.containsKey(id)) {
      Runtime.trap("Employee already exists");
    };
    let employee : Employee = {
      id;
      name;
      role;
      branch;
    };
    employees.add(id, employee);
  };

  public query ({ caller }) func getBranches() : async [Branch] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view branches");
    };
    branches.values().toArray().sort();
  };

  public query ({ caller }) func getEmployees() : async [Employee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view employee list");
    };
    employees.values().toArray().sort();
  };

  public query ({ caller }) func getBranchSales(branchId : Text) : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view sales data");
    };
    sales.values().toArray().sort().filter(func(sale) { sale.branch == branchId });
  };

  public query ({ caller }) func getBranchBookings(branchId : Text) : async [Prebooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view bookings");
    };
    prebookings.values().toArray().sort().filter(func(booking) { booking.status == branchId });
  };

  public query ({ caller }) func getLoyaltyMembers() : async [LoyaltyMember] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only employees can view loyalty members");
    };
    loyaltyMembers.values().toArray().sort();
  };
};
