import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';

interface FuelGaugeProps {
  currentLevel: number;
  capacity: number;
  fuelType: 'petrol' | 'diesel';
  threshold: number;
}

export default function FuelGauge({ currentLevel, capacity, fuelType, threshold }: FuelGaugeProps) {
  const percentage = (currentLevel / capacity) * 100;
  const isLow = currentLevel < threshold;

  const color = fuelType === 'petrol' ? 'text-amber-600' : 'text-green-600';
  const bgColor = fuelType === 'petrol' ? 'bg-amber-600' : 'bg-green-600';

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <img
          src="/assets/generated/fuel-gauge.dim_400x400.png"
          alt="Fuel Gauge"
          className="w-48 h-48 mx-auto opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-4xl font-bold ${color}`}>{percentage.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">{currentLevel.toFixed(0)}L</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Level</span>
          <span className="font-medium">{currentLevel.toFixed(0)} / {capacity}L</span>
        </div>
        <Progress value={percentage} className={`h-3 ${isLow ? 'bg-destructive/20' : ''}`} />
        {isLow && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Low stock warning - Below threshold ({threshold}L)</span>
          </div>
        )}
      </div>
    </div>
  );
}
