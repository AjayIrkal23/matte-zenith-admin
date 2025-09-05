import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Department } from "@/types/department";
import { DepartmentList } from "@/components/departments/DepartmentList";
import { AddDepartmentDialog } from "@/components/departments/AddDepartmentDialog";
import { EditDepartmentDialog } from "@/components/departments/EditDepartmentDialog";
import { DeleteDepartmentAlert } from "@/components/departments/DeleteDepartmentAlert";

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
  const [formData, setFormData] = useState({ name: "", description: "" });

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

      <DepartmentList
        departments={departments}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddDepartmentDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        formData={formData}
        onChange={setFormData}
        onConfirm={confirmAdd}
      />

      <EditDepartmentDialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
        formData={formData}
        onChange={setFormData}
        onConfirm={confirmEdit}
      />

      <DeleteDepartmentAlert
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        departmentName={selectedDepartment?.name}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}
