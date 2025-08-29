import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Kpi {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface KpiCardsProps {
  data: Kpi[];
  variants: any;
}

function KpiCards({ data, variants }: KpiCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={variants}
    >
      {data.map((kpi) => (
        <motion.div
          key={kpi.title}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-panel-bg border-panel-border hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm font-medium">{kpi.title}</p>
                  <p className="text-2xl font-bold text-text-primary">{kpi.value}</p>
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
  );
}

export default memo(KpiCards);
