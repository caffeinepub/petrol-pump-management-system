import { FuelType } from '../backend';
import { Card } from '@/components/ui/card';

interface PaymentSummaryProps {
  fuelType: FuelType;
  quantity: number;
  unitPrice: number;
}

const GST_RATE = 0.18;

export default function PaymentSummary({ fuelType, quantity, unitPrice }: PaymentSummaryProps) {
  const baseAmount = quantity * unitPrice;
  const gstAmount = baseAmount * GST_RATE;
  const totalAmount = baseAmount + gstAmount;

  return (
    <Card className="p-4 space-y-2 bg-muted/50">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Fuel Type:</span>
        <span className="font-medium capitalize">{fuelType}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Unit Price:</span>
        <span className="font-medium">₹{unitPrice.toFixed(2)}/L</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Quantity:</span>
        <span className="font-medium">{quantity.toFixed(2)}L</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Base Amount:</span>
        <span className="font-medium">₹{baseAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">GST (18%):</span>
        <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-base font-bold pt-2 border-t">
        <span>Total Amount:</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>
    </Card>
  );
}
