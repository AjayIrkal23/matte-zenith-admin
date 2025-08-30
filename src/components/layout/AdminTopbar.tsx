import { Building2, Zap, Shield, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
}

const StatCard = ({ icon: Icon, label, value, iconColor }: StatCardProps) => (
  <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 flex items-center gap-2 backdrop-blur-sm shadow-sm">
    <Icon className={`w-4 h-4 ${iconColor}`} />
    <div className="text-left leading-tight">
      <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  </div>
);

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const stats: StatCardProps[] = [
    { icon: Zap, label: "$mPG", value: "1.23m", iconColor: "text-yellow-400" },
    { icon: Shield, label: "PG", value: "50", iconColor: "text-sky-400" },
    { icon: Star, label: "PGXP", value: "1,150", iconColor: "text-amber-300" },
  ];

  return (
    <header className="h-20 bg-gradient-to-r from-adani-primary to-adani-secondary text-white flex-shrink-0">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            onClick={onToggleSidebar}
            className="text-white/80 hover:text-white transition-colors"
          />

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Adani Group</h2>
              <p className="text-xs opacity-80">Safety Monitoring</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </header>
  );
}
