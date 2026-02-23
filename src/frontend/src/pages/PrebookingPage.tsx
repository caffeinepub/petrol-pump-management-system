import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreatePrebookingForm from '../components/CreatePrebookingForm';
import PrebookingList from '../components/PrebookingList';

export default function PrebookingPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access prebooking</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to manage prebookings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fuel Prebooking</h1>
        <p className="text-muted-foreground">Reserve fuel for large vehicles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Prebooking</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePrebookingForm branchId={selectedBranchId} />
        </CardContent>
      </Card>

      <PrebookingList branchId={selectedBranchId} />
    </div>
  );
}
