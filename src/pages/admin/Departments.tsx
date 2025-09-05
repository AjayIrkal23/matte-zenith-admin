import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DepartmentList } from "@/components/departments/DepartmentList";
import { AddDepartmentDialog } from "@/components/departments/AddDepartmentDialog";
import { EditDepartmentDialog } from "@/components/departments/EditDepartmentDialog";
import { DeleteDepartmentAlert } from "@/components/departments/DeleteDepartmentAlert";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  selectDepartments,
  selectDepartmentStatus,
  selectDepartmentError,
} from "@/store/slices/departmentSlice";
import type { IDepartment } from "@/types/department";

export default function DepartmentsPage() {
  const dispatch = useAppDispatch();
  const departments = useAppSelector(selectDepartments);
  const status = useAppSelector(selectDepartmentStatus);
  const error = useAppSelector(selectDepartmentError);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<IDepartment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headName: "",
    headEmail: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error]);

  const handleAdd = () => {
    setFormData({ name: "", description: "", headName: "", headEmail: "" });
    setShowAddModal(true);
  };

  const handleEdit = (department: IDepartment) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      headName: department.headName,
      headEmail: department.headEmail,
    });
    setShowEditModal(true);
  };

  const handleDelete = (department: IDepartment) => {
    setSelectedDepartment(department);
    setShowDeleteAlert(true);
  };

  const confirmAdd = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.headName.trim() ||
      !formData.headEmail.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      createDepartment({
        name: formData.name.trim(),
        description: formData.description.trim(),
        headName: formData.headName.trim(),
        headEmail: formData.headEmail.trim(),
        employeeCount: 0,
        validatedImages: 0,
        averageScore: 0,
      })
    )
      .unwrap()
      .then(() => {
        setShowAddModal(false);
        toast({
          title: "Success",
          description: "Department added successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add department",
          variant: "destructive",
        });
      });
  };

  const confirmEdit = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.headName.trim() ||
      !formData.headEmail.trim() ||
      !selectedDepartment
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateDepartment({
        id: selectedDepartment._id,
        updates: {
          name: formData.name.trim(),
          description: formData.description.trim(),
          headName: formData.headName.trim(),
          headEmail: formData.headEmail.trim(),
        },
      })
    )
      .unwrap()
      .then(() => {
        setShowEditModal(false);
        setSelectedDepartment(null);
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update department",
          variant: "destructive",
        });
      });
  };

  const confirmDelete = () => {
    if (!selectedDepartment) return;

    dispatch(deleteDepartment(selectedDepartment._id))
      .unwrap()
      .then(() => {
        setShowDeleteAlert(false);
        setSelectedDepartment(null);
        toast({
          title: "Success",
          description: "Department deleted successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete department",
          variant: "destructive",
        });
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
