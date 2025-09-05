import { motion } from "framer-motion";
import { Bot } from "lucide-react"; // robot icon
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IViolation } from "@/types/admin";
import { getSeverityBadgeStyle } from "./utils";

interface ViolationsListProps {
  violations: IViolation[];
  aivalidated: boolean;
}

export function ViolationsList({
  violations,
  aivalidated,
}: ViolationsListProps) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-4">
        <h3 className="font-medium text-text-primary mb-4">
          Violations ({violations.length})
        </h3>

        {violations.length > 0 ? (
          <div className="space-y-3">
            {violations.map((violation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-3 rounded-lg bg-hover-overlay/30 border border-panel-border"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-text-primary text-sm">
                    {violation.name}
                  </h4>
                  <Badge
                    className={`text-xs ${getSeverityBadgeStyle(
                      violation.severity
                    )}`}
                  >
                    {violation.severity}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted">
                  {violation.description}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {/* Animated robot */}
            <motion.div
              className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-10 h-10 text-blue-400" />
            </motion.div>

            <p className="text-sm text-text-primary font-medium">
              AI is analyzing this image…
            </p>
            {aivalidated && (
              <p className="text-xs text-text-muted mt-1">
                No violations detected — this image appears compliant
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
