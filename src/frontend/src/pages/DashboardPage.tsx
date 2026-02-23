import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetBranches, useGetBranchStock, useGetBranchSales } from '../hooks/useQueries';
import { useBranch } from '../contexts/BranchContext';
import ProfileSetup from '../components/ProfileSetup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { selectedBranchId } = useBranch();
  const { data: branches } = useGetBranches();
  const { data: stockLevels } = useGetBranchStock(selectedBranchId);
  const { data: sales } = useGetBranchSales(selectedBranchId);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const selectedBranch = useMemo(() => {
    return branches?.find((b) => b.id === selectedBranchId);
  }, [branches, selectedBranchId]);

  const todaySales = useMemo(() => {
    if (!sales) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter((sale) => {
      const saleDate = new Date(Number(sale.timestamp) / 1000000);
      return saleDate >= today;
    });
  }, [sales]);

  const todayRevenue = useMemo(() => {
    return todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }, [todaySales]);

  const todayVolume = useMemo(() => {
    return todaySales.reduce((sum, sale) => sum + sale.quantity, 0);
  }, [todaySales]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src="/assets/generated/dashboard-hero.dim_1920x400.png"
            alt="Dashboard Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="container">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to FuelStation Manager
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Comprehensive petrol pump management system with real-time inventory tracking, sales management, and analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-amber-600" />
                Fuel Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track petrol and diesel inventory with real-time stock levels and automated alerts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Sales & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record sales with multiple payment methods and generate digital receipts instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive reporting with daily, weekly, and monthly sales analysis and tax reports.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-muted-foreground">
              Please login to access the management dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProfileSetup open={showProfileSetup} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userProfile && (
            <p className="text-muted-foreground">Welcome back, {userProfile.name}!</p>
          )}
        </div>

        {!selectedBranchId ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-muted-foreground">
                Please select a branch from the dropdown above to view dashboard
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{todayRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{todaySales.length} transactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Sold Today</CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayVolume.toFixed(2)}L</div>
                  <p className="text-xs text-muted-foreground">Total volume</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Petrol Stock</CardTitle>
                  <Fuel className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockLevels ? stockLevels.petrol.toFixed(0) : '0'}L
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedBranch && stockLevels
                      ? `${((stockLevels.petrol / 10000) * 100).toFixed(1)}% capacity`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diesel Stock</CardTitle>
                  <Fuel className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockLevels ? stockLevels.diesel.toFixed(0) : '0'}L
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedBranch && stockLevels
                      ? `${((stockLevels.diesel / 10000) * 100).toFixed(1)}% capacity`
                      : 'Loading...'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {selectedBranch && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Fuel Prices - {selectedBranch.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Petrol</p>
                        <p className="text-2xl font-bold text-amber-600">
                          ₹{selectedBranch.petrolPrice.toFixed(2)}/L
                        </p>
                      </div>
                      <Fuel className="h-8 w-8 text-amber-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Diesel</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{selectedBranch.dieselPrice.toFixed(2)}/L
                        </p>
                      </div>
                      <Fuel className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
