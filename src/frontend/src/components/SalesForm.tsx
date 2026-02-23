import { useState } from 'react';
import { useRecordSale, useGetBranches } from '../hooks/useQueries';
import { FuelType, PaymentMethod } from '../backend';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import PaymentSummary from './PaymentSummary';

interface SalesFormProps {
  branchId: string;
}

export default function SalesForm({ branchId }: SalesFormProps) {
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.petrol);
  const [quantity, setQuantity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.cash);

  const recordSale = useRecordSale();
  const { data: branches } = useGetBranches();

  const branch = branches?.find((b) => b.id === branchId);
  const unitPrice = fuelType === FuelType.petrol ? branch?.petrolPrice || 0 : branch?.dieselPrice || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    await recordSale.mutateAsync({
      branchId,
      fuelType,
      quantity: qty,
      paymentMethod,
    });

    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PaymentMethod.cash}>Cash</SelectItem>
            <SelectItem value={PaymentMethod.card}>Card</SelectItem>
            <SelectItem value={PaymentMethod.upi}>UPI</SelectItem>
            <SelectItem value={PaymentMethod.wallet}>Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {quantity && parseFloat(quantity) > 0 && (
        <PaymentSummary fuelType={fuelType} quantity={parseFloat(quantity)} unitPrice={unitPrice} />
      )}

      <Button type="submit" className="w-full" disabled={recordSale.isPending || !quantity}>
        {recordSale.isPending ? 'Recording...' : 'Record Sale'}
      </Button>
    </form>
  );
}
