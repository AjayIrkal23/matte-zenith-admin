import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, TrendingUp } from "lucide-react";

interface LeaderboardStatsProps {
  totalUsers: number;
  totalValidatedImages: number;
}

const LeaderboardStats = ({
  totalUsers,
  totalValidatedImages,
}: LeaderboardStatsProps) => {
  const averageScore =
    totalUsers > 0 ? Math.round(totalValidatedImages / totalUsers) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-adani-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-adani-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Total Users</p>
              <p className="text-2xl font-bold text-text-primary">{totalUsers}</p>
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
              <p className="text-2xl font-bold text-text-primary">
                {totalValidatedImages}
              </p>
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
              <p className="text-2xl font-bold text-text-primary">{averageScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardStats;

