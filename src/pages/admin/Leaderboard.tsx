import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  recomputeLeaderboard,
  selectTop3,
  selectLeaderboardAll,
  selectLeaderboardStatus,
  selectLeaderboardError,
  selectUserRank,
} from "@/store/slices/leaderboardSlice";
import { fetchUsers } from "@/store/slices/usersSlice";
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import TopPerformers from "@/components/leaderboard/TopPerformers";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import RankModal from "@/components/leaderboard/RankModal";
import CurrentPositionCard from "@/components/leaderboard/CurrentPositionCard";
import {
  PageHeaderSkeleton,
  StatsCardSkeleton,
  TopPerformersSkeleton,
  LeaderboardTableSkeleton,
} from "@/components/ui/skeletons";

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const top3 = useAppSelector(selectTop3);
  const allUsers = useAppSelector(selectLeaderboardAll);
  const status = useAppSelector(selectLeaderboardStatus);
  const error = useAppSelector(selectLeaderboardError);
  const totalValidatedImages = useMemo(
    () => allUsers.reduce((sum, u) => sum + u.validatedImages, 0),
    [allUsers]
  );

  // Get current user's rank (mock user for demo)
  const userRank = useAppSelector((state) => selectUserRank(state, "2")); // Using user ID "2" as demo
  const [showRankModal, setShowRankModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchUsers());
      dispatch(recomputeLeaderboard());
    };
    if (status === "idle") loadData();
  }, [status, dispatch]);

  useEffect(() => {
    // Show modal after a small delay to let the page load
    const timer = setTimeout(() => {
      setShowRankModal(true);
      setHasShownModal(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [allUsers.length, hasShownModal, userRank]);

  if (status === "loading" && allUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StatsCardSkeleton />
          </div>
          <StatsCardSkeleton />
        </div>
        <TopPerformersSkeleton />
        <LeaderboardTableSkeleton />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-text-muted mt-1">
            Top performers based on validated images
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeaderboardStats
            totalUsers={allUsers.length}
            totalValidatedImages={totalValidatedImages}
          />
        </div>
        <CurrentPositionCard
          userRank={userRank ?? 3}
          userName="Rajesh Kumar"
          totalUsers={allUsers.length}
          validatedImages={245} // Mock validated images for current user
        />
      </div>

      {top3.length > 0 && <TopPerformers top3={top3} status={status} />}

      <LeaderboardTable users={allUsers} status={status} />

      <RankModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        userRank={userRank ?? 3}
        userName="Rajesh Kumar" // Replace with actual user name
        totalUsers={allUsers.length}
      />
    </motion.div>
  );
}
