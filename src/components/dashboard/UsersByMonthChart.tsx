import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  data: any[];
  variants: any;
}

function UsersByMonthChart({ data, variants }: Props) {
  return (
    <motion.div variants={variants}>
      <Card className="bg-panel-bg border-panel-border">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Users by Month
          </CardTitle>
          <CardDescription>Monthly user registration trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--panel-border))" />
                <XAxis dataKey="month" stroke="hsl(var(--text-muted))" fontSize={12} />
                <YAxis stroke="hsl(var(--text-muted))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "black",
                    border: "1px solid hsl(var(--panel-border))",
                    borderRadius: "8px",
                    color: "hsl(var(--text-primary))",
                  }}
                />
                <Bar dataKey="users" fill="hsl(var(--adani-primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(UsersByMonthChart);
