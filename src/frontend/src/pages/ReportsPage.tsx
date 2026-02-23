import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { useGetBranchSales } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import SalesReportSummary from '../components/SalesReportSummary';
import { useState, useMemo } from 'react';

export default function ReportsPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();
  const { data: sales } = useGetBranchSales(selectedBranchId);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const filteredSales = useMemo(() => {
    if (!sales) return [];

    const now = new Date();
    const startDate = new Date();

    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    return sales.filter((sale) => {
      const saleDate = new Date(Number(sale.timestamp) / 1000000);
      return saleDate >= startDate;
    });
  }, [sales, period]);

  const handleExport = () => {
    if (!filteredSales) return;

    const csv = [
      ['Date', 'Fuel Type', 'Quantity', 'Payment Method', 'Amount'].join(','),
      ...filteredSales.map((sale) =>
        [
          new Date(Number(sale.timestamp) / 1000000).toLocaleString(),
          sale.fuelType,
          sale.quantity,
          sale.paymentMethod,
          sale.totalAmount,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${period}-${Date.now()}.csv`;
    a.click();
  };

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access reports</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to view reports</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-muted-foreground">Comprehensive sales analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <SalesReportSummary sales={filteredSales} />
    </div>
  );
}
