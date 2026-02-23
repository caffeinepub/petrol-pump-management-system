import { useState } from 'react';
import { useGetLoyaltyMembers } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoyaltyMemberCard from './LoyaltyMemberCard';

export default function LoyaltyMemberList() {
  const { data: members, isLoading } = useGetLoyaltyMembers();
  const [search, setSearch] = useState('');

  const filteredMembers = members?.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.phone.includes(search) ||
    member.id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading members...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Members</CardTitle>
        <Input
          placeholder="Search by name, phone, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        {!filteredMembers || filteredMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No members found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <LoyaltyMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
