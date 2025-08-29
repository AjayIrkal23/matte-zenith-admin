import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  recomputeLeaderboard,
  selectTop3,
  selectLeaderboardAll,
  selectLeaderboardStatus,
  selectLeaderboardError,
} from "@/store/slices/leaderboardSlice";
import { fetchUsers, selectTotalValidatedImages } from "@/store/slices/usersSlice";
import { toast } from "@/hooks/use-toast";
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import TopPerformers from "@/components/leaderboard/TopPerformers";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const top3 = useAppSelector(selectTop3);
  const allUsers = useAppSelector(selectLeaderboardAll);
  const status = useAppSelector(selectLeaderboardStatus);
  const error = useAppSelector(selectLeaderboardError);
  const totalValidatedImages = useAppSelector(selectTotalValidatedImages);

  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchUsers());
      dispatch(recomputeLeaderboard());
    };
    if (status === "idle") loadData();
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error]);

  useEffect(() => {
    if (!hasShownConfetti && allUsers.length > 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast({
        title: "🎉 Congratulations!",
        description: "You are in dummy #2 position.",
        duration: 5000,
      });
      setHasShownConfetti(true);
    }
  }, [allUsers.length, hasShownConfetti]);

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

      <LeaderboardStats
        totalUsers={allUsers.length}
        totalValidatedImages={totalValidatedImages}
      />

      {top3.length > 0 && <TopPerformers top3={top3} status={status} />}

      <LeaderboardTable users={allUsers} status={status} />
    </motion.div>
  );
}

