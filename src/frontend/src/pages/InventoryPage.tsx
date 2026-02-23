import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { useGetBranches, useGetBranchStock } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FuelGauge from '../components/FuelGauge';
import StockAlerts from '../components/StockAlerts';

export default function InventoryPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();
  const { data: branches } = useGetBranches();
  const { data: stockLevels } = useGetBranchStock(selectedBranchId);

  const branch = branches?.find((b) => b.id === selectedBranchId);

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access inventory management</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to view inventory</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Real-time fuel stock monitoring</p>
      </div>

      {branch && stockLevels && <StockAlerts branch={branch} stockLevels={stockLevels} />}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Petrol Tank</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <FuelGauge
              currentLevel={stockLevels?.petrol || 0}
              capacity={10000}
              fuelType="petrol"
              threshold={branch?.lowStockThreshold || 1000}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Diesel Tank</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <FuelGauge
              currentLevel={stockLevels?.diesel || 0}
              capacity={10000}
              fuelType="diesel"
              threshold={branch?.lowStockThreshold || 1000}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
