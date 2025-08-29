import { memo } from "react";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
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

function ImagesTotalsChart({ data, variants }: Props) {
  return (
    <motion.div variants={variants}>
      <Card className="bg-panel-bg border-panel-border">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Images className="w-5 h-5" />
            Images: Total vs Validated
          </CardTitle>
          <CardDescription>Image processing progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
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
                <Bar dataKey="totalImages" fill="hsl(var(--adani-secondary))" name="Total Images" radius={[2, 2, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="validatedImages"
                  stroke="hsl(var(--adani-primary))"
                  strokeWidth={3}
                  name="Validated Images"
                  dot={{ fill: "hsl(var(--adani-primary))", strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(ImagesTotalsChart);
