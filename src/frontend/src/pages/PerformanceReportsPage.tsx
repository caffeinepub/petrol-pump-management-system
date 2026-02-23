import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBranch } from '../contexts/BranchContext';
import { useGetBranchSales, useGetEmployees } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmployeePerformanceCard from '../components/EmployeePerformanceCard';
import { useMemo } from 'react';

export default function PerformanceReportsPage() {
  const { identity } = useInternetIdentity();
  const { selectedBranchId } = useBranch();
  const { data: sales } = useGetBranchSales(selectedBranchId);
  const { data: employees } = useGetEmployees();

  const performanceData = useMemo(() => {
    if (!sales || !employees) return [];

    const employeeMap = new Map();

    sales.forEach((sale) => {
      const empId = sale.employee.toString();
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employee: sale.employee,
          totalSales: 0,
          totalVolume: 0,
          totalRevenue: 0,
        });
      }

      const data = employeeMap.get(empId);
      data.totalSales += 1;
      data.totalVolume += sale.quantity;
      data.totalRevenue += sale.totalAmount;
    });

    return Array.from(employeeMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [sales, employees]);

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please login to access performance reports</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedBranchId) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Please select a branch to view performance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Performance</h1>
        <p className="text-muted-foreground">Sales metrics and rankings</p>
      </div>

      {performanceData.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No performance data available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {performanceData.map((data, index) => (
            <EmployeePerformanceCard
              key={data.employee.toString()}
              employeePrincipal={data.employee}
              totalSales={data.totalSales}
              totalVolume={data.totalVolume}
              totalRevenue={data.totalRevenue}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
