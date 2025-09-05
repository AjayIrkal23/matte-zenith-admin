import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  onAddUser: () => void;
}

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Users Management
        </h1>
        <p className="text-text-muted mt-1">
          Manage employee accounts and permissions
        </p>
      </div>
      <Button onClick={onAddUser} className="btn-adani">
        <Plus className="w-4 h-4 mr-2" />
        Add User
      </Button>
    </div>
  );
}