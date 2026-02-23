import { useGetBranchBookings, useUpdatePrebookingStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PrebookingListProps {
  branchId: string;
}

export default function PrebookingList({ branchId }: PrebookingListProps) {
  const { data: bookings, isLoading } = useGetBranchBookings(branchId);
  const updateStatus = useUpdatePrebookingStatus();

  const handleStatusChange = async (bookingId: bigint, newStatus: string) => {
    await updateStatus.mutateAsync({ prebookingId: bookingId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading prebookings...</p>
        </CardContent>
      </Card>
    );
  }

  const sortedBookings = [...(bookings || [])].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prebooking List</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedBookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No prebookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBookings.map((booking) => (
                  <TableRow key={Number(booking.id)}>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.contactNumber}</TableCell>
                    <TableCell className="capitalize">{booking.fuelType}</TableCell>
                    <TableCell>{booking.quantity.toFixed(2)}L</TableCell>
                    <TableCell>
                      {new Date(Number(booking.requiredDeliveryDate) / 1000000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
