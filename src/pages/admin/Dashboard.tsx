import { useEffect, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Users, Images, CheckCircle, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUsers } from "@/store/slices/usersSlice";
import { fetchImages } from "@/store/slices/imagesSlice";
import { recomputeLeaderboard, selectTop3 } from "@/store/slices/leaderboardSlice";
import {
  selectKpis,
  selectUsersByMonth,
  selectImagesTotalsByMonth,
  selectAiHumanDelta,
} from "@/store/selectors/metricsSelectors";

const KpiCards = lazy(() => import("@/components/dashboard/KpiCards"));
const UsersByMonthChart = lazy(() => import("@/components/dashboard/UsersByMonthChart"));
const ImagesTotalsChart = lazy(() => import("@/components/dashboard/ImagesTotalsChart"));
const TopPerformers = lazy(() => import("@/components/dashboard/TopPerformers"));
const AiHumanDeltaCard = lazy(() => import("@/components/dashboard/AiHumanDeltaCard"));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const kpis = useAppSelector(selectKpis);
  const top3 = useAppSelector(selectTop3);
  const usersByMonth = selectUsersByMonth();
  const imagesTotals = selectImagesTotalsByMonth();
  const aiHumanDelta = selectAiHumanDelta();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchImages({ page: 1, pageSize: 50 }));
    dispatch(recomputeLeaderboard());
  }, [dispatch]);

  const kpiData = useMemo(
    () => [
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
    ],
    [kpis]
  );

  return (
    <motion.div
      className="p-2 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">Overview of safety monitoring activities</p>
      </motion.div>

      <Suspense fallback={<div>Loading KPIs...</div>}>
        <KpiCards data={kpiData} variants={itemVariants} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading Users by Month...</div>}>
          <UsersByMonthChart data={usersByMonth} variants={itemVariants} />
        </Suspense>
        <Suspense fallback={<div>Loading Images...</div>}>
          <ImagesTotalsChart data={imagesTotals} variants={itemVariants} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading Top Performers...</div>}>
          <TopPerformers data={top3} variants={itemVariants} />
        </Suspense>
        <Suspense fallback={<div>Loading AI stats...</div>}>
          <AiHumanDeltaCard data={aiHumanDelta} variants={itemVariants} />
        </Suspense>
      </div>
    </motion.div>
  );
}
