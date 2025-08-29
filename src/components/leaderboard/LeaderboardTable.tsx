import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { AsyncStatus, IUser } from "@/types/admin";
import { getInitials, getRankColorClass } from "./utils";

interface LeaderboardTableProps {
  users: IUser[];
  status: AsyncStatus;
}

const LeaderboardTable = ({ users, status }: LeaderboardTableProps) => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-text-primary">
          Complete Leaderboard ({users.length} users)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-hover-overlay/30 rounded-lg animate-pulse shimmer"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-panel-border">
                  <TableHead className="text-text-muted w-16">Rank</TableHead>
                  <TableHead className="text-text-muted">User</TableHead>
                  <TableHead className="text-text-muted">Department</TableHead>
                  <TableHead className="text-text-muted">Employee ID</TableHead>
                  <TableHead className="text-text-muted text-right">
                    Validated Images
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className={`hover:bg-hover-overlay/50 border-panel-border transition-colors ${
                        isTopThree ? "bg-adani-primary/5" : ""
                      }`}
                    >
                      <TableCell>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankColorClass(rank)}`}
                        >
                          {rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-adani-primary/20 text-adani-primary text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-text-primary">
                              {user.name}
                            </div>
                            <div className="text-xs text-text-muted">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-hover-overlay/50 px-2 py-1 rounded text-adani-primary">
                          {user.empid}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-semibold ${
                            isTopThree ? "text-adani-primary" : "text-text-primary"
                          }`}
                        >
                          {user.validatedImages}
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>

            {users.length === 0 && status === "succeeded" && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-text-muted">
                  No users found. Add some users to see the leaderboard.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;

