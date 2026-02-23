import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Plus } from 'lucide-react';
import type { LoyaltyMember } from '../backend';
import PointsTransactionModal from './PointsTransactionModal';

interface LoyaltyMemberCardProps {
  member: LoyaltyMember;
}

export default function LoyaltyMemberCard({ member }: LoyaltyMemberCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-base">{member.name}</span>
            <Gift className="h-5 w-5 text-amber-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Member ID</p>
            <p className="font-mono text-sm">{member.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm">{member.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold text-amber-600">{Number(member.totalPoints)}</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="w-full gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Add Points
          </Button>
        </CardContent>
      </Card>

      {showModal && (
        <PointsTransactionModal memberId={member.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
