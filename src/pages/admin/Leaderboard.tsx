import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  recomputeLeaderboard,
  selectTop3,
  selectLeaderboardAll,
  selectLeaderboardStatus,
  selectLeaderboardError
} from '@/store/slices/leaderboardSlice';
import { fetchUsers, selectTotalValidatedImages } from '@/store/slices/usersSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const top3 = useAppSelector(selectTop3);
  const allUsers = useAppSelector(selectLeaderboardAll);
  const status = useAppSelector(selectLeaderboardStatus);
  const error = useAppSelector(selectLeaderboardError);
  const totalValidatedImages = useAppSelector(selectTotalValidatedImages);

  useEffect(() => {
    const loadData = async () => {
      // First ensure users are loaded
      await dispatch(fetchUsers());
      // Then compute leaderboard
      dispatch(recomputeLeaderboard());
    };
    
    if (status === 'idle') {
      loadData();
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Medal;
      case 3: return Award;
      default: return Trophy;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1: return 'top-rank-1';
      case 2: return 'top-rank-2';
      case 3: return 'top-rank-3';
      default: return 'bg-hover-overlay/50';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDepartmentBadgeVariant = (department: string) => {
    switch (department) {
      case 'Safety Engineering': return 'destructive';
      case 'Operations': return 'default';
      case 'Quality Assurance': return 'secondary';
      default: return 'outline';
    }
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
          <h1 className="text-3xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-text-muted mt-1">Top performers based on validated images</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-adani-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-adani-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">{allUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-adani-secondary/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-adani-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Validations</p>
                <p className="text-2xl font-bold text-text-primary">{totalValidatedImages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Average Score</p>
                <p className="text-2xl font-bold text-text-primary">
                  {allUsers.length > 0 ? Math.round(totalValidatedImages / allUsers.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-text-primary flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'loading' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-hover-overlay/30 rounded-xl animate-pulse shimmer" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3.map((user, index) => {
                  const rank = index + 1;
                  const IconComponent = getRankIcon(rank);
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <Card className={`glass-panel card-hover ${getRankBadgeClass(rank)}`}>
                        <CardContent className="p-6 text-center space-y-4">
                          <div className="relative">
                            <Avatar className="w-20 h-20 mx-auto border-4 border-white/20">
                              <AvatarFallback className="bg-adani-primary text-white text-xl font-bold">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                              rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                            }`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-bold text-lg text-text-primary">{user.name}</h3>
                            <Badge variant={getDepartmentBadgeVariant(user.department)} className="text-xs">
                              {user.department}
                            </Badge>
                          </div>

                          <motion.div
                            className="space-y-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          >
                            <div className="text-3xl font-bold text-adani-primary animate-count-up">
                              {user.validatedImages}
                            </div>
                            <p className="text-sm text-text-muted">Validated Images</p>
                          </motion.div>

                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                            }`} />
                            <span className="text-sm text-text-muted">Rank #{rank}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard Table */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-text-primary">
            Complete Leaderboard ({allUsers.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-hover-overlay/30 rounded-lg animate-pulse shimmer" />
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
                    <TableHead className="text-text-muted text-right">Validated Images</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((user, index) => {
                    const rank = index + 1;
                    const isTopThree = rank <= 3;
                    
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`hover:bg-hover-overlay/50 border-panel-border transition-colors ${
                          isTopThree ? 'bg-adani-primary/5' : ''
                        }`}
                      >
                        <TableCell>
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            rank === 1 ? 'bg-yellow-500 text-white' :
                            rank === 2 ? 'bg-gray-400 text-white' :
                            rank === 3 ? 'bg-amber-600 text-white' :
                            'bg-hover-overlay text-text-muted'
                          }`}>
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
                              <div className="font-medium text-text-primary">{user.name}</div>
                              <div className="text-xs text-text-muted">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDepartmentBadgeVariant(user.department)} className="text-xs">
                            {user.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-hover-overlay/50 px-2 py-1 rounded text-adani-primary">
                            {user.empid}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            isTopThree ? 'text-adani-primary' : 'text-text-primary'
                          }`}>
                            {user.validatedImages}
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>

              {allUsers.length === 0 && status === 'succeeded' && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted">No users found. Add some users to see the leaderboard.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}