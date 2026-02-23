import { useState } from 'react';
import { useCreateBranch } from '../hooks/useQueries';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CreateBranchForm() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const createBranch = useCreateBranch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !location) return;

    await createBranch.mutateAsync({ id, name, location });
    setId('');
    setName('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="branchId">Branch ID</Label>
        <Input
          id="branchId"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="BR001"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="branchName">Branch Name</Label>
        <Input
          id="branchName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Main Station"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="branchLocation">Location</Label>
        <Input
          id="branchLocation"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="123 Main St, City"
        />
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={createBranch.isPending}>
          {createBranch.isPending ? 'Creating...' : 'Create Branch'}
        </Button>
      </div>
    </form>
  );
}
