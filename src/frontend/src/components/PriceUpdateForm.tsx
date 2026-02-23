import { useState } from 'react';
import { useGetBranches, useUpdateFuelPrices } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function PriceUpdateForm() {
  const [branchId, setBranchId] = useState('');
  const [petrolPrice, setPetrolPrice] = useState('');
  const [dieselPrice, setDieselPrice] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: branches } = useGetBranches();
  const updatePrices = useUpdateFuelPrices();

  const selectedBranch = branches?.find((b) => b.id === branchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    const petrol = parseFloat(petrolPrice);
    const diesel = parseFloat(dieselPrice);
    if (isNaN(petrol) || isNaN(diesel) || !branchId) return;

    await updatePrices.mutateAsync({ branchId, petrolPrice: petrol, dieselPrice: diesel });
    setPetrolPrice('');
    setDieselPrice('');
    setShowConfirm(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Update Fuel Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBranch && (
              <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Petrol Price</p>
                  <p className="text-lg font-bold text-amber-600">₹{selectedBranch.petrolPrice.toFixed(2)}/L</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Diesel Price</p>
                  <p className="text-lg font-bold text-green-600">₹{selectedBranch.dieselPrice.toFixed(2)}/L</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="petrolPrice">New Petrol Price (₹/L)</Label>
                <Input
                  id="petrolPrice"
                  type="number"
                  step="0.01"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(e.target.value)}
                  placeholder="Enter new price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dieselPrice">New Diesel Price (₹/L)</Label>
                <Input
                  id="dieselPrice"
                  type="number"
                  step="0.01"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(e.target.value)}
                  placeholder="Enter new price"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!branchId || !petrolPrice || !dieselPrice}>
              Update Prices
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Price Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update fuel prices for {selectedBranch?.name}?
              <div className="mt-4 space-y-2">
                <p>Petrol: ₹{petrolPrice}/L</p>
                <p>Diesel: ₹{dieselPrice}/L</p>
              </div>
              This will affect all new transactions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>Confirm Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
