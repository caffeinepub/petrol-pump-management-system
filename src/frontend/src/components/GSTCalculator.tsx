import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Sale } from '../backend';
import { useMemo } from 'react';

interface GSTCalculatorProps {
  sales: Sale[];
}

const GST_RATE = 0.18;

export default function GSTCalculator({ sales }: GSTCalculatorProps) {
  const gstMetrics = useMemo(() => {
    const petrolSales = sales.filter((s) => s.fuelType === 'petrol');
    const dieselSales = sales.filter((s) => s.fuelType === 'diesel');

    const calculateGST = (salesList: Sale[]) => {
      const totalWithGST = salesList.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const taxableAmount = totalWithGST / (1 + GST_RATE);
      const gstAmount = totalWithGST - taxableAmount;
      return { totalWithGST, taxableAmount, gstAmount };
    };

    const petrolGST = calculateGST(petrolSales);
    const dieselGST = calculateGST(dieselSales);
    const totalGST = calculateGST(sales);

    return {
      petrol: petrolGST,
      diesel: dieselGST,
      total: totalGST,
    };
  }, [sales]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Petrol GST Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Sales (incl. GST)</span>
            <span className="font-medium">₹{gstMetrics.petrol.totalWithGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxable Amount</span>
            <span className="font-medium">₹{gstMetrics.petrol.taxableAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">GST Collected (18%)</span>
            <span className="font-bold text-amber-600">₹{gstMetrics.petrol.gstAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diesel GST Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Sales (incl. GST)</span>
            <span className="font-medium">₹{gstMetrics.diesel.totalWithGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxable Amount</span>
            <span className="font-medium">₹{gstMetrics.diesel.taxableAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">GST Collected (18%)</span>
            <span className="font-bold text-green-600">₹{gstMetrics.diesel.gstAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Total GST Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Total Sales (incl. GST)</span>
            <span className="font-medium">₹{gstMetrics.total.totalWithGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-muted-foreground">Total Taxable Amount</span>
            <span className="font-medium">₹{gstMetrics.total.taxableAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-2xl">
            <span className="font-bold">Total GST Liability</span>
            <span className="font-bold text-blue-600">₹{gstMetrics.total.gstAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
