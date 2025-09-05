import { memo } from "react";
import { motion } from "framer-motion";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUser } from "@/types/admin";

interface Props {
  data: IUser[];
  variants: any;
}

function TopPerformers({ data, variants }: Props) {
  const Row = memo(({ index, style }: ListChildComponentProps) => {
    const user = data[index];
    return (
      <div
        style={style}
        className="flex items-center justify-between p-3 rounded-lg bg-hover-overlay/30 hover:bg-hover-overlay/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              index === 0
                ? "bg-yellow-500/20 text-yellow-300"
                : index === 1
                ? "bg-gray-400/20 text-gray-300"
                : "bg-orange-500/20 text-orange-300"
            }`}
          >
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-text-primary">{user.name}</p>
            <p className="text-sm text-text-muted">{user.department}</p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-adani-primary/20 text-adani-primary border-adani-primary/30"
        >
          {user.validatedImages} images
        </Badge>
      </div>
    );
  });

  const height = Math.min(data.length, 3) * 72;

  return (
    <motion.div variants={variants} className="lg:col-span-2">
      <Card className="bg-panel-bg border-panel-border">
        <CardHeader>
          <CardTitle className="text-text-primary">Top Performers</CardTitle>
          <CardDescription>Leading users by validated images</CardDescription>
        </CardHeader>
        <CardContent>
          <List height={height} itemCount={data.length} itemSize={72} width="100%">
            {Row}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(TopPerformers);
