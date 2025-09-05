import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { AsyncStatus, IUser } from "@/types/admin";
import {
  getRankIcon,
  getRankBadgeClass,
  getRankColorClass,
  getInitials,
} from "./utils";

interface TopPerformersProps {
  top3: IUser[];
  status: AsyncStatus;
}

const TopPerformers = ({ top3, status }: TopPerformersProps) => {
  if (top3.length === 0) return null;

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-text-primary flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-hover-overlay/30 rounded-xl animate-pulse shimmer"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((user, index) => {
              const rank = index + 1;
              const Icon = getRankIcon(rank);

              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <Card
                    className={`glass-panel card-hover ${getRankBadgeClass(rank)}`}
                  >
                    <CardContent className="p-6 text-center space-y-1">
                      <div className="relative">
                        <Avatar className="w-20 h-20 mx-auto border-4 border-white/20">
                          <AvatarFallback className="bg-adani-primary text-white text-xl font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${getRankColorClass(rank)}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-text-primary">
                          {user.name}
                        </h3>
                        <Badge className="text-xs">{user.department}</Badge>
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
                        <div
                          className={`w-2 h-2 rounded-full ${getRankColorClass(rank)}`}
                        />
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
  );
};

export default TopPerformers;

