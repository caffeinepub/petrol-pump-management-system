import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { useGetBranchSales, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import GSTCalculator from '../components/GSTCalculator';

export default function TaxReportsPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();
  const { data: sales } = useGetBranchSales(selectedBranchId);
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access tax reports</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to view tax reports</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GST & Tax Reports</h1>
        <p className="text-muted-foreground">Tax calculations and compliance</p>
      </div>

      <GSTCalculator sales={sales || []} />
    </div>
  );
}
