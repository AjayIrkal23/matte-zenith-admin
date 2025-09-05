import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Department } from "@/types/department";

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  return (
    <Card className="bg-panel-bg border-panel-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-text-primary mb-1">
              {department.name}
            </CardTitle>
            <Badge variant="secondary">{department.userCount} users</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(department)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(department)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-muted mb-3">
          {department.description}
        </p>
        <p className="text-xs text-text-muted">
          Created: {new Date(department.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
