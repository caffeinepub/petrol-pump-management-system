import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import PriceUpdateForm from '../components/PriceUpdateForm';

export default function PriceManagementPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access price management</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fuel Price Management</h1>
        <p className="text-muted-foreground">Update fuel prices for branches</p>
      </div>

      <PriceUpdateForm />
    </div>
  );
}
