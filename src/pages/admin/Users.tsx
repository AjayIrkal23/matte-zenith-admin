import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchUsers,
  deleteUser,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from "@/store/slices/usersSlice";
import {
  selectSelectedDepartment,
  selectUsersSearchQuery,
} from "@/store/slices/usersUiSlice";
import { toast } from "@/hooks/use-toast";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { IUser } from "@/types/admin";
import {
  PageHeaderSkeleton,
  FilterSectionSkeleton,
  TableSkeleton,
} from "@/components/ui/skeletons";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  // UI state from Redux
  const selectedDepartment = useAppSelector(selectSelectedDepartment);
  const searchQuery = useAppSelector(selectUsersSearchQuery);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers({}));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const filteredUsers = users.filter((user) => {
    // Search query filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empid.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter
    const matchesDepartment =
      !selectedDepartment || user.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.empid)).unwrap();
        toast({
          title: "Success",
          description: `User ${userToDelete.name} deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };


  if (status === "loading" && users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <PageHeaderSkeleton />
        <FilterSectionSkeleton />
        <TableSkeleton rows={10} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <UsersHeader
        onAddUser={() => {
          setSelectedUser(null);
          setIsFormModalOpen(true);
        }}
      />

      <UsersFilters />

      <UsersTable
        users={filteredUsers}
        status={status}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onConfirm={confirmDeleteUser}
      />
    </motion.div>
  );
}
