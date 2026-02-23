import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterMemberForm from '../components/RegisterMemberForm';
import LoyaltyMemberList from '../components/LoyaltyMemberList';

export default function LoyaltyPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access loyalty program</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Program</h1>
        <p className="text-muted-foreground">Manage customer rewards and memberships</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register New Member</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterMemberForm />
        </CardContent>
      </Card>

      <LoyaltyMemberList />
    </div>
  );
}
