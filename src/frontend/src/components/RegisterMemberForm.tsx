import { useState } from 'react';
import { useRegisterLoyaltyMember } from '../hooks/useQueries';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function RegisterMemberForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const registerMember = useRegisterLoyaltyMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const memberId = await registerMember.mutateAsync({ name, phone });
    toast.success(`Member registered! ID: ${memberId}`);
    setName('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="memberName">Name</Label>
        <Input
          id="memberName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memberPhone">Phone Number</Label>
        <Input
          id="memberPhone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 1234567890"
        />
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={registerMember.isPending}>
          {registerMember.isPending ? 'Registering...' : 'Register Member'}
        </Button>
      </div>
    </form>
  );
}
