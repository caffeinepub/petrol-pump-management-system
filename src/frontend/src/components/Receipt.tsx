import type { Sale } from '../backend';
import { Separator } from '@/components/ui/separator';

interface ReceiptProps {
  sale: Sale;
}

const GST_RATE = 0.18;

export default function Receipt({ sale }: ReceiptProps) {
  const baseAmount = sale.totalAmount / (1 + GST_RATE);
  const gstAmount = sale.totalAmount - baseAmount;

  return (
    <div className="space-y-4 p-4 bg-white text-black print:p-0">
      <div className="text-center">
        <h2 className="text-xl font-bold">FuelStation Manager</h2>
        <p className="text-sm text-gray-600">Transaction Receipt</p>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Receipt No:</span>
          <span className="font-medium">#{Number(sale.id).toString().padStart(6, '0')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date & Time:</span>
          <span className="font-medium">
            {new Date(Number(sale.timestamp) / 1000000).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Branch:</span>
          <span className="font-medium">{sale.branch}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Fuel Type:</span>
          <span className="font-medium capitalize">{sale.fuelType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium">{sale.quantity.toFixed(2)} Liters</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Base Amount:</span>
          <span className="font-medium">₹{baseAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">GST (18%):</span>
          <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total Amount:</span>
        <span>₹{sale.totalAmount.toFixed(2)}</span>
      </div>

      <div className="text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium capitalize">{sale.paymentMethod}</span>
        </div>
      </div>

      <Separator />

      <div className="text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
        <p>Drive safe!</p>
      </div>
    </div>
  );
}
