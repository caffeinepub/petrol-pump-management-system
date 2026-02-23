import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SalesForm from '../components/SalesForm';
import SalesHistory from '../components/SalesHistory';

export default function SalesPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access sales management</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to manage sales</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <p className="text-muted-foreground">Record fuel sales and view transaction history</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesForm branchId={selectedBranchId} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <SalesHistory branchId={selectedBranchId} />
        </div>
      </div>
    </div>
  );
}
