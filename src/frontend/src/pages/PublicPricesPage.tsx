import { useGetBranches } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PriceDisplayCard from '../components/PriceDisplayCard';

export default function PublicPricesPage() {
  const { data: branches, isLoading } = useGetBranches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Current Fuel Prices</h1>
        <p className="text-muted-foreground">Check today's fuel rates at all locations</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading prices...</p>
          </CardContent>
        </Card>
      ) : !branches || branches.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No price information available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader>
                <CardTitle>{branch.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{branch.location}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <PriceDisplayCard fuelType="petrol" price={branch.petrolPrice} />
                  <PriceDisplayCard fuelType="diesel" price={branch.dieselPrice} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
