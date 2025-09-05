import { Building2, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DepartmentCard } from "./DepartmentCard";
import type { IDepartment } from "@/types/department";

interface DepartmentListProps {
  departments: IDepartment[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (department: IDepartment) => void;
  onDelete: (department: IDepartment) => void;
}

export function DepartmentList({
  departments,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}: DepartmentListProps) {
  const filtered = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-text-primary flex items-center gap-2">
          <Building2 className="w-6 h-6 text-adani-primary" />
          Departments ({departments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((department) => (
            <DepartmentCard
              key={department._id}
              department={department}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">No departments found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
