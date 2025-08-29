import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, AlertTriangle } from "lucide-react";
import { getSeverityStatusStyle } from "./utils";

interface ImageStatsProps {
  totalImages: number;
  violationStats: Record<string, number>;
}

export const ImageStats: React.FC<ImageStatsProps> = ({
  totalImages,
  violationStats,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <Card className="glass-panel">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-adani-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-adani-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-text-muted">Total Images</p>
            <p className="text-2xl font-bold text-text-primary">{totalImages}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {Object.entries(violationStats).map(([severity, count]) => (
      <Card key={severity} className="glass-panel">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStatusStyle(
                severity
              )}`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-muted">{severity}</p>
              <p className="text-2xl font-bold text-text-primary">{count}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ImageStats;
