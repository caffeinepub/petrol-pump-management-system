import { useState } from 'react';
import { useCreatePrebooking } from '../hooks/useQueries';
import { FuelType } from '../backend';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CreatePrebookingFormProps {
  branchId: string;
}

export default function CreatePrebookingForm({ branchId }: CreatePrebookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.petrol);
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const createPrebooking = useCreatePrebooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0 || !customerName || !contactNumber || !deliveryDate) return;

    const deliveryTimestamp = BigInt(new Date(deliveryDate).getTime() * 1000000);

    await createPrebooking.mutateAsync({
      customerName,
      contactNumber,
      fuelType,
      quantity: qty,
      requiredDeliveryDate: deliveryTimestamp,
    });

    setCustomerName('');
    setContactNumber('');
    setQuantity('');
    setDeliveryDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="+91 1234567890"
        />
      </div>

      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <Select value={fuelType} onValueChange={(value) => setFuelType(value as FuelType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FuelType.petrol}>Petrol</SelectItem>
            <SelectItem value={FuelType.diesel}>Diesel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity (Liters)</Label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryDate">Required Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="datetime-local"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={createPrebooking.isPending}>
          {createPrebooking.isPending ? 'Creating...' : 'Create Prebooking'}
        </Button>
      </div>
    </form>
  );
}
