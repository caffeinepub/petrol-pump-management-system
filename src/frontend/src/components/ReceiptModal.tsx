import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Receipt from './Receipt';
import type { Sale } from '../backend';
import { Printer } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
}

export default function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>
        <Receipt sale={sale} />
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex-1 gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
