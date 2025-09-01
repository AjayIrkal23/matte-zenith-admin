import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
}

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Safety Department",
    description: "Responsible for workplace safety compliance and monitoring",
    userCount: 25,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Operations",
    description: "Manages daily operational activities and processes",
    userCount: 42,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Maintenance",
    description: "Equipment maintenance and facility upkeep",
    userCount: 18,
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Security",
    description: "Site security and access control management",
    userCount: 15,
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Quality Assurance",
    description: "Quality control and assurance processes",
    userCount: 12,
    createdAt: "2024-01-20",
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: "", description: "" });
    setShowAddModal(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
    });
    setShowEditModal(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteAlert(true);
  };

  const confirmAdd = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newDepartment: Department = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      userCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setDepartments([...departments, newDepartment]);
    setShowAddModal(false);
    toast({
      title: "Success",
      description: "Department added successfully",
    });
  };

  const confirmEdit = () => {
    if (!formData.name.trim() || !formData.description.trim() || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setDepartments(
      departments.map((dept) =>
        dept.id === selectedDepartment.id
          ? {
              ...dept,
              name: formData.name.trim(),
              description: formData.description.trim(),
            }
          : dept
      )
    );

    setShowEditModal(false);
    setSelectedDepartment(null);
    toast({
      title: "Success",
      description: "Department updated successfully",
    });
  };

  const confirmDelete = () => {
    if (!selectedDepartment) return;

    setDepartments(departments.filter((dept) => dept.id !== selectedDepartment.id));
    setShowDeleteAlert(false);
    setSelectedDepartment(null);
    toast({
      title: "Success",
      description: "Department deleted successfully",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Department Management</h1>
          <p className="text-text-muted mt-1">
            Manage departments and organizational structure
          </p>
        </div>
        <Button onClick={handleAdd} className="self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="bg-panel-bg border-panel-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-text-primary mb-1">
                        {department.name}
                      </CardTitle>
                      <Badge variant="secondary">
                        {department.userCount} users
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(department)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(department)}
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
            ))}
          </div>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No departments found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Department Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter department description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter department description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department
              "{selectedDepartment?.name}" and may affect user assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}