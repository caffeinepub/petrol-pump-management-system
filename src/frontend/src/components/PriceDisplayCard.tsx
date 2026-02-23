import { Card } from '@/components/ui/card';
import { Fuel } from 'lucide-react';

interface PriceDisplayCardProps {
  fuelType: 'petrol' | 'diesel';
  price: number;
}

export default function PriceDisplayCard({ fuelType, price }: PriceDisplayCardProps) {
  const color = fuelType === 'petrol' ? 'text-amber-600' : 'text-green-600';
  const bgColor = fuelType === 'petrol' ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-green-50 dark:bg-green-950/20';

  return (
    <Card className={`${bgColor} border-2`}>
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase">{fuelType}</p>
          <p className={`text-4xl font-bold ${color}`}>₹{price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">per liter</p>
        </div>
        <Fuel className={`h-12 w-12 ${color} opacity-50`} />
      </div>
    </Card>
  );
}
