import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmployeeList from '../components/EmployeeList';
import CreateEmployeeForm from '../components/CreateEmployeeForm';

export default function EmployeesPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access employee management</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <p className="text-muted-foreground">Manage staff and track attendance</p>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateEmployeeForm />
          </CardContent>
        </Card>
      )}

      <EmployeeList />
    </div>
  );
}
