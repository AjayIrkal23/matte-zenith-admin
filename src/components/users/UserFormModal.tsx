import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { addUser, editUser } from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { IUser, UserFormData } from '@/types/admin';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: IUser | null;
}

const departments = [
  'Safety Engineering',
  'Operations',
  'Quality Assurance',
  'Maintenance',
  'Security',
  'Administration',
];

const inputClass = 'bg-hover-overlay/30 border-panel-border focus:border-adani-primary/50 focus:ring-adani-primary/20';
const selectTriggerClass = 'bg-hover-overlay/30 border-panel-border focus:border-adani-primary/50';

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const dispatch = useAppDispatch();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  const watchedDepartment = watch('department');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        empid: user.empid,
        department: user.department,
        validatedImages: user.validatedImages,
      });
    } else {
      reset();
    }
  }, [user, reset]);

  const onSubmit = useCallback(async (data: UserFormData) => {
    try {
      if (isEditing && user) {
        await dispatch(editUser({ id: user.id, userData: data })).unwrap();
        toast({
          title: 'Success',
          description: `User ${data.name} updated successfully`,
        });
      } else {
        await dispatch(addUser(data)).unwrap();
        toast({
          title: 'Success',
          description: `User ${data.name} created successfully`,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update user' : 'Failed to create user',
        variant: 'destructive',
      });
    }
  }, [isEditing, user, dispatch, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-panel-bg border-panel-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary flex items-center justify-between">
            {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {isEditing 
              ? 'Update user information and permissions' 
              : 'Create a new user account with the required details'
            }
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-primary text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className={inputClass}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="empid" className="text-text-primary text-sm font-medium">
                  Employee ID
                </Label>
                <Input
                  id="empid"
                  {...register('empid', { required: 'Employee ID is required' })}
                  className={inputClass}
                  placeholder="EMP001"
                />
                {errors.empid && (
                  <p className="text-red-400 text-sm">{errors.empid.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={inputClass}
                placeholder="user@adani.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={watchedDepartment}
                  onValueChange={(value) => setValue('department', value)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-panel-bg border-panel-border">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-text-primary hover:bg-hover-overlay">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-red-400 text-sm">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validatedImages" className="text-text-primary text-sm font-medium">
                  Validated Images
                </Label>
                <Input
                  id="validatedImages"
                  type="number"
                  min="0"
                  {...register('validatedImages', { 
                    required: 'Validated images count is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be a positive number' }
                  })}
                  className={inputClass}
                  placeholder="0"
                />
                {errors.validatedImages && (
                  <p className="text-red-400 text-sm">{errors.validatedImages.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-adani"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update User' : 'Create User')
                }
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}