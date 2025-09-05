import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/skeletons";
import { IUser } from "@/types/admin";

interface UsersTableProps {
  users: IUser[];
  status: string;
  onEditUser: (user: IUser) => void;
  onDeleteUser: (user: IUser) => void;
}

export function UsersTable({ 
  users, 
  status, 
  onEditUser, 
  onDeleteUser 
}: UsersTableProps) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-text-primary">
          All Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-panel-border">
                  <TableHead className="text-text-muted">Name</TableHead>
                  <TableHead className="text-text-muted">
                    Employee ID
                  </TableHead>
                  <TableHead className="text-text-muted">
                    Department
                  </TableHead>
                  <TableHead className="text-text-muted">Email</TableHead>
                  <TableHead className="text-text-muted text-center">
                    Validated Images
                  </TableHead>
                  <TableHead className="text-text-muted text-center">
                    Score
                  </TableHead>
                  <TableHead className="text-text-muted text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-hover-overlay/50 border-panel-border transition-colors"
                  >
                    <TableCell>
                      <div className="font-medium text-text-primary">
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-hover-overlay/50 px-2 py-1 rounded text-adani-primary">
                        {user.empid}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs bg-panel-bg/50 border-panel-border text-text-secondary"
                      >
                        {user.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-adani-primary">
                        {user.validatedImages}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-green-400">
                        {user.score || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUser(user)}
                          className="text-text-muted hover:text-adani-primary hover:bg-hover-overlay"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteUser(user)}
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

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">
                  No users found matching your search.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}