import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    headName: string;
    headEmail: string;
  };
  onChange: (
    data: {
      name: string;
      description: string;
      headName: string;
      headEmail: string;
    }
  ) => void;
  onConfirm: () => void;
}

export function AddDepartmentDialog({
  open,
  onOpenChange,
  formData,
  onChange,
  onConfirm,
}: AddDepartmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Create a new department for your organization
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder="Enter department name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onChange({ ...formData, description: e.target.value })
              }
              placeholder="Enter department description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="headName">Head Name</Label>
            <Input
              id="headName"
              value={formData.headName}
              onChange={(e) =>
                onChange({ ...formData, headName: e.target.value })
              }
              placeholder="Enter head's name"
            />
          </div>
          <div>
            <Label htmlFor="headEmail">Head Email</Label>
            <Input
              id="headEmail"
              type="email"
              value={formData.headEmail}
              onChange={(e) =>
                onChange({ ...formData, headEmail: e.target.value })
              }
              placeholder="Enter head's email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Add Department</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
