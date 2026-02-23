import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Fuel } from 'lucide-react';
import type { Branch } from '../backend';

interface BranchLocationCardProps {
  branch: Branch;
}

export default function BranchLocationCard({ branch }: BranchLocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {branch.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="text-sm font-medium">{branch.location}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Branch ID</p>
          <p className="text-sm font-mono">{branch.id}</p>
        </div>
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-amber-600" />
            <span className="text-muted-foreground">Petrol & Diesel Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
