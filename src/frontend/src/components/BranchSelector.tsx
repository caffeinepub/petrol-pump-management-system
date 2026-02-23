import { useBranch } from '../contexts/BranchContext';
import { useGetBranches } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export default function BranchSelector() {
  const { selectedBranchId, setSelectedBranchId } = useBranch();
  const { data: branches, isLoading } = useGetBranches();

  if (isLoading || !branches || branches.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedBranchId || ''} onValueChange={setSelectedBranchId}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
