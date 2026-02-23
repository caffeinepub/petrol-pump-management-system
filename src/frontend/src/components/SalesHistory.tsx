import { useState } from 'react';
import { useGetBranchSales } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import ReceiptModal from './ReceiptModal';
import type { Sale } from '../backend';

interface SalesHistoryProps {
  branchId: string;
}

export default function SalesHistory({ branchId }: SalesHistoryProps) {
  const { data: sales, isLoading } = useGetBranchSales(branchId);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading sales history...</p>
        </CardContent>
      </Card>
    );
  }

  const sortedSales = [...(sales || [])].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedSales.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sales recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSales.map((sale) => (
                    <TableRow key={Number(sale.id)}>
                      <TableCell>
                        {new Date(Number(sale.timestamp) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{sale.fuelType}</TableCell>
                      <TableCell>{sale.quantity.toFixed(2)}L</TableCell>
                      <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                      <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSale && (
        <ReceiptModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </>
  );
}
