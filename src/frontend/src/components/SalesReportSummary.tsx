import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Fuel, CreditCard, TrendingUp } from 'lucide-react';
import type { Sale } from '../backend';
import { useMemo } from 'react';

interface SalesReportSummaryProps {
  sales: Sale[];
}

export default function SalesReportSummary({ sales }: SalesReportSummaryProps) {
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const petrolVolume = sales
      .filter((s) => s.fuelType === 'petrol')
      .reduce((sum, sale) => sum + sale.quantity, 0);
    const dieselVolume = sales
      .filter((s) => s.fuelType === 'diesel')
      .reduce((sum, sale) => sum + sale.quantity, 0);

    const paymentBreakdown = {
      cash: sales.filter((s) => s.paymentMethod === 'cash').length,
      card: sales.filter((s) => s.paymentMethod === 'card').length,
      upi: sales.filter((s) => s.paymentMethod === 'upi').length,
      wallet: sales.filter((s) => s.paymentMethod === 'wallet').length,
    };

    return {
      totalRevenue,
      petrolVolume,
      dieselVolume,
      totalTransactions: sales.length,
      paymentBreakdown,
    };
  }, [sales]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{metrics.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{metrics.totalTransactions} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Petrol Sold</CardTitle>
          <Fuel className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.petrolVolume.toFixed(2)}L</div>
          <p className="text-xs text-muted-foreground">Total volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diesel Sold</CardTitle>
          <Fuel className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.dieselVolume.toFixed(2)}L</div>
          <p className="text-xs text-muted-foreground">Total volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cash:</span>
              <span className="font-medium">{metrics.paymentBreakdown.cash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Card:</span>
              <span className="font-medium">{metrics.paymentBreakdown.card}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UPI:</span>
              <span className="font-medium">{metrics.paymentBreakdown.upi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wallet:</span>
              <span className="font-medium">{metrics.paymentBreakdown.wallet}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
