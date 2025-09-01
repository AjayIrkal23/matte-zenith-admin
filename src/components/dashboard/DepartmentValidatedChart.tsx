import { memo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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

function DepartmentValidatedChart({ data, variants }: Props) {
  return (
    <motion.div variants={variants}>
      <Card className="bg-panel-bg border-panel-border">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Department-wise Validation
          </CardTitle>
          <CardDescription>Monthly validation progress by department</CardDescription>
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
                <Legend />
                <Bar dataKey="safety" fill="hsl(var(--adani-primary))" name="Safety Dept" radius={[2, 2, 0, 0]} />
                <Bar dataKey="operations" fill="hsl(var(--adani-secondary))" name="Operations" radius={[2, 2, 0, 0]} />
                <Bar dataKey="maintenance" fill="#10B981" name="Maintenance" radius={[2, 2, 0, 0]} />
                <Bar dataKey="security" fill="#F59E0B" name="Security" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(DepartmentValidatedChart);