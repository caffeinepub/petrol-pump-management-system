import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp } from 'lucide-react';
import type { Principal } from '@dfinity/principal';

interface EmployeePerformanceCardProps {
  employeePrincipal: Principal;
  totalSales: number;
  totalVolume: number;
  totalRevenue: number;
  rank: number;
}

export default function EmployeePerformanceCard({
  employeePrincipal,
  totalSales,
  totalVolume,
  totalRevenue,
  rank,
}: EmployeePerformanceCardProps) {
  const rankColor = rank === 1 ? 'text-amber-600' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm truncate">{employeePrincipal.toString().slice(0, 10)}...</span>
          <div className={`flex items-center gap-1 ${rankColor}`}>
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-bold">#{rank}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total Sales:</span>
          <span className="font-medium">{totalSales}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Volume Sold:</span>
          <span className="font-medium">{totalVolume.toFixed(2)}L</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Revenue:</span>
          <span className="font-bold text-green-600">₹{totalRevenue.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <TrendingUp className="h-3 w-3" />
          <span>Avg: ₹{(totalRevenue / totalSales).toFixed(2)} per sale</span>
        </div>
      </CardContent>
    </Card>
  );
}
