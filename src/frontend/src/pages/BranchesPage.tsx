import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetBranches } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateBranchForm from '../components/CreateBranchForm';
import BranchList from '../components/BranchList';

export default function BranchesPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access branch management</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branch Management</h1>
        <p className="text-muted-foreground">Manage multiple pump locations</p>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateBranchForm />
          </CardContent>
        </Card>
      )}

      <BranchList />
    </div>
  );
}
