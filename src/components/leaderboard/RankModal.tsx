import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Medal, Award, Trophy, TrendingUp } from "lucide-react";
import { getRankIcon, getRankColorClass } from "./utils";

interface RankModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRank: number;
  userName: string;
  totalUsers: number;
}

export default function RankModal({
  isOpen,
  onClose,
  userRank,
  userName,
  totalUsers,
}: RankModalProps) {
  const isTopThree = userRank <= 3;
  const RankIcon = getRankIcon(userRank);

  const handleClose = () => {
    onClose();
  };

  // Trigger confetti for top 3
  if (isOpen && isTopThree) {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#C0C0C0", "#CD7F32", "#2F6FED"],
      });
    }, 300);
  }

  const getRankMessage = () => {
    switch (userRank) {
      case 1:
        return {
          title: "🎉 Congratulations Champion!",
          message: `Amazing work ${userName}! You're #1 in the leaderboard!`,
          subtitle: "You're leading the pack with outstanding performance!",
        };
      case 2:
        return {
          title: "🥈 Excellent Performance!",
          message: `Great job ${userName}! You're #2 in the leaderboard!`,
          subtitle: "You're so close to the top! Keep pushing!",
        };
      case 3:
        return {
          title: "🥉 Outstanding Achievement!",
          message: `Well done ${userName}! You're #3 in the leaderboard!`,
          subtitle: "You're in the top 3! Fantastic work!",
        };
      default:
        return {
          title: "🌟 You're Doing Great!",
          message: `Keep validating and climb the ladder, ${userName}! 🚀`,
          subtitle: `You're ranked #${userRank} out of ${totalUsers} users.`,
        };
    }
  };

  const { title, message, subtitle } = getRankMessage();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-panel-bg border-panel-border text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="space-y-6 py-4"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-24 h-24"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center ${getRankColorClass(
                userRank
              )} shadow-lg`}
            >
              <RankIcon className="w-12 h-12" />
            </div>
            {isTopThree && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -inset-2 rounded-full border-2 border-yellow-400/30 animate-pulse"
              />
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>

            <p className="text-lg text-text-secondary">{message}</p>

            {!isTopThree && (
              <TrendingUp className="w-8 h-8 mx-auto text-adani-primary" />
            )}

            <p className="text-text-muted">{subtitle}</p>

            {/* Rank Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-adani-primary/20 text-adani-primary border border-adani-primary/30"
            >
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">Rank #{userRank}</span>
            </motion.div>
          </motion.div>

          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Button onClick={handleClose} className="btn-adani">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
