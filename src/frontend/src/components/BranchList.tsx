import { useGetBranches } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Fuel } from 'lucide-react';

export default function BranchList() {
  const { data: branches, isLoading } = useGetBranches();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading branches...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Branches</CardTitle>
      </CardHeader>
      <CardContent>
        {!branches || branches.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No branches found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4 text-primary" />
                    {branch.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm">{branch.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Petrol Stock</p>
                      <p className="text-sm font-medium text-amber-600">
                        {branch.petrolStock.toFixed(0)}L
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diesel Stock</p>
                      <p className="text-sm font-medium text-green-600">
                        {branch.dieselStock.toFixed(0)}L
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Petrol Price</p>
                      <p className="text-sm font-medium">₹{branch.petrolPrice.toFixed(2)}/L</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Diesel Price</p>
                      <p className="text-sm font-medium">₹{branch.dieselPrice.toFixed(2)}/L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
