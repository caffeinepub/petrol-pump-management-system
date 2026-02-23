import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Branch, FuelStockLevel } from '../backend';

interface StockAlertsProps {
  branch: Branch;
  stockLevels: FuelStockLevel;
}

interface AlertItem {
  fuelType: string;
  currentLevel: number;
  threshold: number;
}

export default function StockAlerts({ branch, stockLevels }: StockAlertsProps) {
  const alerts: AlertItem[] = [];

  if (stockLevels.petrol < branch.lowStockThreshold) {
    alerts.push({
      fuelType: 'Petrol',
      currentLevel: stockLevels.petrol,
      threshold: branch.lowStockThreshold,
    });
  }

  if (stockLevels.diesel < branch.lowStockThreshold) {
    alerts.push({
      fuelType: 'Diesel',
      currentLevel: stockLevels.diesel,
      threshold: branch.lowStockThreshold,
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.fuelType} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert - {alert.fuelType}</AlertTitle>
          <AlertDescription>
            Current level: {alert.currentLevel.toFixed(0)}L | Threshold: {alert.threshold}L | 
            Please reorder fuel immediately.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
