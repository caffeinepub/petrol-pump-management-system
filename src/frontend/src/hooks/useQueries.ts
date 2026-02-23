import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Branch, Sale, Employee, LoyaltyMember, LoyaltyPointTransaction, Prebooking, FuelType, PaymentMethod, UserProfile } from '../backend';
import { toast } from 'sonner';

// Branches
export function useGetBranches() {
  const { actor, isFetching } = useActor();

  return useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBranches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBranch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, location }: { id: string; name: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBranch(id, name, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });
}

export function useUpdateBranchStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ branchId, petrolStock, dieselStock }: { branchId: string; petrolStock: number; dieselStock: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBranchStock(branchId, petrolStock, dieselStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branchStock'] });
      toast.success('Stock updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update stock');
    },
  });
}

export function useGetBranchStock(branchId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['branchStock', branchId],
    queryFn: async () => {
      if (!actor || !branchId) return null;
      return actor.getBranchStockLevels(branchId);
    },
    enabled: !!actor && !isFetching && !!branchId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}

export function useUpdateFuelPrices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ branchId, petrolPrice, dieselPrice }: { branchId: string; petrolPrice: number; dieselPrice: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFuelPrices(branchId, petrolPrice, dieselPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Fuel prices updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update prices');
    },
  });
}

// Sales
export function useGetBranchSales(branchId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Sale[]>({
    queryKey: ['sales', branchId],
    queryFn: async () => {
      if (!actor || !branchId) return [];
      return actor.getBranchSales(branchId);
    },
    enabled: !!actor && !isFetching && !!branchId,
  });
}

export function useRecordSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ branchId, fuelType, quantity, paymentMethod }: { branchId: string; fuelType: FuelType; quantity: number; paymentMethod: PaymentMethod }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordSale(branchId, fuelType, quantity, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branchStock'] });
      toast.success('Sale recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record sale');
    },
  });
}

// Employees
export function useGetEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, role, branch }: { id: string; name: string; role: string; branch: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEmployee(id, name, role, branch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create employee');
    },
  });
}

// Loyalty
export function useGetLoyaltyMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<LoyaltyMember[]>({
    queryKey: ['loyaltyMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoyaltyMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterLoyaltyMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerLoyaltyMember(name, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyMembers'] });
      toast.success('Member registered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register member');
    },
  });
}

export function useAddLoyaltyPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, points, reason, saleId }: { memberId: string; points: bigint; reason: string; saleId: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLoyaltyPoints(memberId, points, reason, saleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyMembers'] });
      queryClient.invalidateQueries({ queryKey: ['loyaltyTransactions'] });
      toast.success('Points added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add points');
    },
  });
}

export function useGetLoyaltyPointTransactions(memberId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<LoyaltyPointTransaction[]>({
    queryKey: ['loyaltyTransactions', memberId],
    queryFn: async () => {
      if (!actor || !memberId) return [];
      return actor.getLoyaltyPointTransactions(memberId);
    },
    enabled: !!actor && !isFetching && !!memberId,
  });
}

// Prebooking
export function useGetBranchBookings(branchId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Prebooking[]>({
    queryKey: ['bookings', branchId],
    queryFn: async () => {
      if (!actor || !branchId) return [];
      return actor.getBranchBookings(branchId);
    },
    enabled: !!actor && !isFetching && !!branchId,
  });
}

export function useCreatePrebooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerName, contactNumber, fuelType, quantity, requiredDeliveryDate }: { customerName: string; contactNumber: string; fuelType: FuelType; quantity: number; requiredDeliveryDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPrebooking(customerName, contactNumber, fuelType, quantity, requiredDeliveryDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Prebooking created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create prebooking');
    },
  });
}

export function useUpdatePrebookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prebookingId, status }: { prebookingId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePrebookingStatus(prebookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
