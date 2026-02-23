import { useState } from 'react';
import { useCreateEmployee, useGetBranches } from '../hooks/useQueries';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function CreateEmployeeForm() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('');

  const createEmployee = useCreateEmployee();
  const { data: branches } = useGetBranches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !role || !branch) return;

    await createEmployee.mutateAsync({ id, name, role, branch });
    setId('');
    setName('');
    setRole('');
    setBranch('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2">
        <Label htmlFor="empId">Employee ID</Label>
        <Input
          id="empId"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="EMP001"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="empName">Name</Label>
        <Input
          id="empName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="empRole">Role</Label>
        <Input
          id="empRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Attendant"
        />
      </div>

      <div className="space-y-2">
        <Label>Branch</Label>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches?.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={createEmployee.isPending}>
          {createEmployee.isPending ? 'Adding...' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}
