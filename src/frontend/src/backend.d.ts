import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoyaltyPointTransaction {
    id: bigint;
    saleId?: bigint;
    employee: Principal;
    timestamp: Time;
    points: bigint;
    reason: string;
}
export type Time = bigint;
export interface LoyaltyMember {
    id: string;
    name: string;
    totalPoints: bigint;
    phone: string;
}
export interface Sale {
    id: bigint;
    branch: string;
    paymentMethod: PaymentMethod;
    employee: Principal;
    fuelType: FuelType;
    totalAmount: number;
    timestamp: Time;
    quantity: number;
}
export interface FuelStockLevel {
    petrol: number;
    diesel: number;
}
export interface Prebooking {
    id: bigint;
    customerName: string;
    status: string;
    fuelType: FuelType;
    timestamp: Time;
    quantity: number;
    contactNumber: string;
    requiredDeliveryDate: Time;
}
export interface Branch {
    id: string;
    dieselPrice: number;
    lowStockThreshold: number;
    name: string;
    petrolStock: number;
    dieselStock: number;
    petrolPrice: number;
    location: string;
}
export interface Employee {
    id: string;
    branch: string;
    name: string;
    role: string;
}
export interface UserProfile {
    branch?: string;
    name: string;
    employeeId?: string;
}
export enum FuelType {
    petrol = "petrol",
    diesel = "diesel"
}
export enum PaymentMethod {
    upi = "upi",
    card = "card",
    cash = "cash",
    wallet = "wallet"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLoyaltyPoints(memberId: string, points: bigint, reason: string, saleId: bigint | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBranch(id: string, name: string, location: string): Promise<void>;
    createEmployee(id: string, name: string, role: string, branch: string): Promise<void>;
    createPrebooking(customerName: string, contactNumber: string, fuelType: FuelType, quantity: number, requiredDeliveryDate: Time): Promise<bigint>;
    getBranchBookings(branchId: string): Promise<Array<Prebooking>>;
    getBranchSales(branchId: string): Promise<Array<Sale>>;
    getBranchStockLevels(branchId: string): Promise<FuelStockLevel>;
    getBranches(): Promise<Array<Branch>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployees(): Promise<Array<Employee>>;
    getLoyaltyMembers(): Promise<Array<LoyaltyMember>>;
    getLoyaltyPointTransactions(memberId: string): Promise<Array<LoyaltyPointTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordSale(branchId: string, fuelType: FuelType, quantity: number, paymentMethod: PaymentMethod): Promise<bigint>;
    registerLoyaltyMember(name: string, phone: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBranchStock(branchId: string, petrolStock: number, dieselStock: number): Promise<void>;
    updateFuelPrices(branchId: string, petrolPrice: number, dieselPrice: number): Promise<void>;
    updatePrebookingStatus(prebookingId: bigint, status: string): Promise<void>;
}
