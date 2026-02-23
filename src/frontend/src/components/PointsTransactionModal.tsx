import { useState } from 'react';
import { useAddLoyaltyPoints } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PointsTransactionModalProps {
  memberId: string;
  onClose: () => void;
}

export default function PointsTransactionModal({ memberId, onClose }: PointsTransactionModalProps) {
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  const addPoints = useAddLoyaltyPoints();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(points);
    if (isNaN(pts) || pts <= 0) return;

    await addPoints.mutateAsync({
      memberId,
      points: BigInt(pts),
      reason: reason || 'Manual points addition',
      saleId: null,
    });

    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Loyalty Points</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="points">Points Amount</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Enter points"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Promotional bonus"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={addPoints.isPending}>
              {addPoints.isPending ? 'Adding...' : 'Add Points'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
