import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUsers, deleteUser, selectUsers, selectUsersStatus, selectUsersError, selectUniqueDepartments } from '@/store/slices/usersSlice';
import { 
  setSelectedDepartment, 
  setValidatedImagesRange, 
  setSearchQuery,
  selectSelectedDepartment,
  selectValidatedImagesRange,
  selectUsersSearchQuery
} from '@/store/slices/usersUiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { IUser } from '@/types/admin';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);
  const uniqueDepartments = useAppSelector(selectUniqueDepartments);
  
  // UI state from Redux
  const selectedDepartment = useAppSelector(selectSelectedDepartment);
  const validatedImagesRange = useAppSelector(selectValidatedImagesRange);
  const searchQuery = useAppSelector(selectUsersSearchQuery);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate max validated images for range slider
  const maxValidatedImages = Math.max(...users.map(u => u.validatedImages), 100);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  const filteredUsers = users.filter(user => {
    // Search query filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empid.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Department filter
    const matchesDepartment = !selectedDepartment || user.department === selectedDepartment;
    
    // Validated Images range filter
    const matchesRange = user.validatedImages >= validatedImagesRange[0] && 
                        user.validatedImages <= validatedImagesRange[1];
    
    return matchesSearch && matchesDepartment && matchesRange;
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
        await dispatch(deleteUser(userToDelete.id)).unwrap();
        toast({
          title: 'Success',
          description: `User ${userToDelete.name} deleted successfully`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          variant: 'destructive',
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const resetFilters = () => {
    dispatch(setSelectedDepartment(undefined));
    dispatch(setValidatedImagesRange([0, maxValidatedImages]));
    dispatch(setSearchQuery(''));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Users Management</h1>
          <p className="text-text-muted mt-1">Manage employee accounts and permissions</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedUser(null);
            setIsFormModalOpen(true);
          }}
          className="btn-adani"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10 bg-hover-overlay/30 border-panel-border focus:border-adani-primary/50"
              />
            </div>
            
            <Select 
              value={selectedDepartment} 
              onValueChange={(value) => dispatch(setSelectedDepartment(value === 'all' ? undefined : value))}
            >
              <SelectTrigger className="bg-hover-overlay/30 border-panel-border">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="bg-panel-bg border-panel-border">
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Validated Images</span>
                <span className="text-adani-primary">
                  {validatedImagesRange[0]} - {validatedImagesRange[1]}
                </span>
              </div>
              <Slider
                value={validatedImagesRange}
                onValueChange={(value) => dispatch(setValidatedImagesRange(value as [number, number]))}
                max={maxValidatedImages}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-text-primary">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-hover-overlay/30 rounded-lg animate-pulse shimmer" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-panel-border">
                    <TableHead className="text-text-muted">Name</TableHead>
                    <TableHead className="text-text-muted">Employee ID</TableHead>
                    <TableHead className="text-text-muted">Department</TableHead>
                    <TableHead className="text-text-muted">Email</TableHead>
                    <TableHead className="text-text-muted text-center">Validated Images</TableHead>
                    <TableHead className="text-text-muted text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-hover-overlay/50 border-panel-border transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-text-primary">{user.name}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-hover-overlay/50 px-2 py-1 rounded text-adani-primary">
                          {user.empid}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-panel-bg/50 border-panel-border text-text-secondary">
                          {user.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-adani-primary">
                          {user.validatedImages}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-text-muted hover:text-adani-primary hover:bg-hover-overlay"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-text-muted hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && status === 'succeeded' && (
                <div className="text-center py-12">
                  <p className="text-text-muted">No users found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-panel-bg border-panel-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}