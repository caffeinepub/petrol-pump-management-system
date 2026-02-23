import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Sale } from '../backend';
import { useMemo } from 'react';

interface ProfitLossStatementProps {
  sales: Sale[];
}

const GST_RATE = 0.18;
const COST_PER_LITER_PETROL = 90; // Example cost
const COST_PER_LITER_DIESEL = 85; // Example cost

export default function ProfitLossStatement({ sales }: ProfitLossStatementProps) {
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const revenueBeforeTax = totalRevenue / (1 + GST_RATE);

    const costOfGoods = sales.reduce((sum, sale) => {
      const costPerLiter = sale.fuelType === 'petrol' ? COST_PER_LITER_PETROL : COST_PER_LITER_DIESEL;
      return sum + sale.quantity * costPerLiter;
    }, 0);

    const grossProfit = revenueBeforeTax - costOfGoods;
    const grossMargin = revenueBeforeTax > 0 ? (grossProfit / revenueBeforeTax) * 100 : 0;

    // Example operating expenses
    const operatingExpenses = costOfGoods * 0.1; // 10% of COGS as operating expenses
    const operatingProfit = grossProfit - operatingExpenses;
    const netProfit = operatingProfit;

    return {
      totalRevenue,
      revenueBeforeTax,
      costOfGoods,
      grossProfit,
      grossMargin,
      operatingExpenses,
      operatingProfit,
      netProfit,
    };
  }, [sales]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Revenue</h3>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Revenue (incl. GST)</span>
            <span className="font-medium">₹{metrics.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Revenue (before tax)</span>
            <span className="font-medium">₹{metrics.revenueBeforeTax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Cost of Goods Sold</h3>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fuel Purchase Cost</span>
            <span className="font-medium text-destructive">₹{metrics.costOfGoods.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Gross Profit</h3>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Profit</span>
            <span className="font-bold text-green-600">₹{metrics.grossProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Margin</span>
            <span className="font-medium">{metrics.grossMargin.toFixed(2)}%</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Operating Expenses</h3>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operating Costs</span>
            <span className="font-medium text-destructive">₹{metrics.operatingExpenses.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Net Profit</h3>
          <div className="flex justify-between text-xl">
            <span className="font-bold">Net Profit</span>
            <span className={`font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              ₹{metrics.netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
