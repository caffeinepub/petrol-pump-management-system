import { useGetEmployees } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function EmployeeList() {
  const { data: employees, isLoading } = useGetEmployees();
  const [search, setSearch] = useState('');

  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.id.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Loading employees...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Roster</CardTitle>
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        {!filteredEmployees || filteredEmployees.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No employees found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="capitalize">{employee.role}</TableCell>
                    <TableCell>{employee.branch}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
