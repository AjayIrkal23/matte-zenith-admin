import { Trophy, Crown, Medal, Award } from "lucide-react";

export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return Crown;
    case 2:
      return Medal;
    case 3:
      return Award;
    default:
      return Trophy;
  }
};

export const getRankBadgeClass = (rank: number) => {
  switch (rank) {
    case 1:
      return "top-rank-1";
    case 2:
      return "top-rank-2";
    case 3:
      return "top-rank-3";
    default:
      return "bg-hover-overlay/50";
  }
};

export const getRankColorClass = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500 text-white";
    case 2:
      return "bg-gray-400 text-white";
    case 3:
      return "bg-amber-600 text-white";
    default:
      return "bg-hover-overlay text-text-white/50";
  }
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

