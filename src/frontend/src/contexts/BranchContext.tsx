import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BranchContextType {
  selectedBranchId: string | null;
  setSelectedBranchId: (branchId: string | null) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(() => {
    return localStorage.getItem('selectedBranchId');
  });

  useEffect(() => {
    if (selectedBranchId) {
      localStorage.setItem('selectedBranchId', selectedBranchId);
    } else {
      localStorage.removeItem('selectedBranchId');
    }
  }, [selectedBranchId]);

  return (
    <BranchContext.Provider value={{ selectedBranchId, setSelectedBranchId }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within BranchProvider');
  }
  return context;
}
