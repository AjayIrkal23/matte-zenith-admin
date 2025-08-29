import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Images,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUsers } from "@/store/slices/usersSlice";
import { fetchImages } from "@/store/slices/imagesSlice";
import {
  recomputeLeaderboard,
  selectTop3,
} from "@/store/slices/leaderboardSlice";
import {
  selectKpis,
  selectUsersByMonth,
  selectImagesTotalsByMonth,
  selectAiHumanDelta,
} from "@/store/selectors/metricsSelectors";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const kpis = useAppSelector(selectKpis);
  const top3 = useAppSelector(selectTop3);
  const usersByMonth = selectUsersByMonth();
  const imagesTotals = selectImagesTotalsByMonth();
  const aiHumanDelta = selectAiHumanDelta();

  // Load data on mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchImages({ page: 1, pageSize: 50 }));
    dispatch(recomputeLeaderboard());
  }, [dispatch]);

  const kpiCards = [
    {
      title: "Total Users",
      value: kpis.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Total Images",
      value: kpis.totalImages,
      icon: Images,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Images Validated",
      value: kpis.imagesValidated,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Violations Validated",
      value: kpis.violationsValidated,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  return (
    <motion.div
      className="p-2 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">
          Overview of safety monitoring activities
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-panel-bg border-panel-border hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm font-medium">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {kpi.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Month */}
        <motion.div variants={itemVariants}>
          <Card className="bg-panel-bg border-panel-border">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Users by Month
              </CardTitle>
              <CardDescription>
                Monthly user registration trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersByMonth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--panel-border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--text-muted))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--text-muted))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "black",
                        border: "1px solid hsl(var(--panel-border))",
                        borderRadius: "8px",
                        color: "hsl(var(--text-primary))",
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill="hsl(var(--adani-primary))"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Images Total vs Validated */}
        <motion.div variants={itemVariants}>
          <Card className="bg-panel-bg border-panel-border">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center gap-2">
                <Images className="w-5 h-5" />
                Images: Total vs Validated
              </CardTitle>
              <CardDescription>
                Image processing progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={imagesTotals}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--panel-border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--text-muted))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--text-muted))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "black",
                        border: "1px solid hsl(var(--panel-border))",
                        borderRadius: "8px",
                        color: "hsl(var(--text-primary))",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalImages"
                      fill="hsl(var(--adani-secondary))"
                      name="Total Images"
                      radius={[2, 2, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="validatedImages"
                      stroke="hsl(var(--adani-primary))"
                      strokeWidth={3}
                      name="Validated Images"
                      dot={{
                        fill: "hsl(var(--adani-primary))",
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Leaderboard */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-panel-bg border-panel-border">
            <CardHeader>
              <CardTitle className="text-text-primary">
                Top Performers
              </CardTitle>
              <CardDescription>
                Leading users by validated images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {top3.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-hover-overlay/30 hover:bg-hover-overlay/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-300"
                            : index === 1
                            ? "bg-gray-400/20 text-gray-300"
                            : "bg-orange-500/20 text-orange-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {user.name}
                        </p>
                        <p className="text-sm text-text-muted">
                          {user.department}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-adani-primary/20 text-adani-primary border-adani-primary/30"
                    >
                      {user.validatedImages} images
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI vs Human Time */}
        <motion.div variants={itemVariants}>
          <Card className="bg-panel-bg border-panel-border">
            <CardHeader>
              <CardTitle className="text-text-primary flex items-center gap-2">
                <Clock className="w-5 h-5" />
                AI–Human Δ
              </CardTitle>
              <CardDescription>
                Average time difference (seconds)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-adani-primary">
                  {aiHumanDelta.deltaAvgSec}s
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">AI Average:</span>
                    <span className="text-green-400">
                      {aiHumanDelta.aiAvgSec}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Human Average:</span>
                    <span className="text-orange-400">
                      {aiHumanDelta.humanAvgSec}s
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  AI is{" "}
                  {Math.round(
                    (aiHumanDelta.deltaAvgSec / aiHumanDelta.humanAvgSec) * 100
                  )}
                  % faster
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
