import { useGetBranches } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BranchLocationCard from '../components/BranchLocationCard';

export default function LocationsPage() {
  const { data: branches, isLoading } = useGetBranches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pump Locations</h1>
        <p className="text-muted-foreground">Find fuel stations near you</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading locations...</p>
          </CardContent>
        </Card>
      ) : !branches || branches.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No branches available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <BranchLocationCard key={branch.id} branch={branch} />
          ))}
        </div>
      )}
    </div>
  );
}
