import { memo } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AiHumanDelta {
  deltaAvgSec: number;
  aiAvgSec: number;
  humanAvgSec: number;
}

interface Props {
  data: AiHumanDelta;
  variants: any;
}

function AiHumanDeltaCard({ data, variants }: Props) {
  return (
    <motion.div variants={variants}>
      <Card className="bg-panel-bg border-panel-border">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5" />
            AI–Human Δ
          </CardTitle>
          <CardDescription>Average time difference (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-adani-primary">
              {data.deltaAvgSec}s
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">AI Average:</span>
                <span className="text-green-400">{data.aiAvgSec}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Human Average:</span>
                <span className="text-orange-400">{data.humanAvgSec}s</span>
              </div>
            </div>
            <p className="text-xs text-text-muted">
              AI is {Math.round((data.deltaAvgSec / data.humanAvgSec) * 100)}% faster
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(AiHumanDeltaCard);
