import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { useGetBranchSales } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import ProfitLossStatement from '../components/ProfitLossStatement';

export default function ProfitLossPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();
  const { data: sales } = useGetBranchSales(selectedBranchId);
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access P&L reports</p>
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
          <p className="text-lg text-muted-foreground">Please select a branch to view P&L</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profit & Loss Analysis</h1>
        <p className="text-muted-foreground">Financial performance overview</p>
      </div>

      <ProfitLossStatement sales={sales || []} />
    </div>
  );
}
