import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CurrentPositionCardProps {
  userRank: number;
  userName: string;
  totalUsers: number;
  validatedImages: number;
}

export default function CurrentPositionCard({ 
  userRank, 
  userName, 
  totalUsers, 
  validatedImages 
}: CurrentPositionCardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-text-muted";
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-panel border-adani-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Trophy className={`w-5 h-5 ${getRankColor(userRank)}`} />
            Your Current Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Rank</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-text-primary">#{userRank}</span>
                <Badge variant={getRankBadge(userRank)}>
                  {userRank <= 3 ? "Top 3" : userRank <= 10 ? "Top 10" : "Active"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Out of</p>
              <span className="text-lg font-semibold text-text-primary">{totalUsers} users</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-adani-primary/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-adani-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">{validatedImages} images validated</p>
              <p className="text-xs text-text-muted">Keep going to climb higher!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}