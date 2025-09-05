import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  AlertTriangle,
  Shield,
  AlertCircle,
  Info,
  Plus,
  Box,
} from "lucide-react";
import { IViolation, IAnnotatedViolation } from "@/types/admin";
import { getSeverityStatusStyle } from "@/components/images/utils";
import type { ElementType } from "react";

interface ViolationsListProps {
  violations: IViolation[];
  annotatedViolations: IAnnotatedViolation[];
  onAddViolation: () => void;
  onRemoveViolation: (index: number) => void;
}

const severityIconMap: Record<string, ElementType> = {
  Critical: AlertTriangle,
  High: Shield,
  Medium: AlertCircle,
  Low: Info,
};

export default function ViolationsList({
  violations,
  annotatedViolations,
  onAddViolation,
  onRemoveViolation,
}: ViolationsListProps) {
  const getAnnotatedViolation = (violationIndex: number) => {
    return annotatedViolations.find(
      (av) => av.name === violations[violationIndex]?.name
    );
  };

  const getAnnotatedCount = () => {
    return violations.filter((_, index) => getAnnotatedViolation(index)).length;
  };

  return (
    <Card className="glass-panel h-fit">
      <CardHeader>
        <CardTitle className="text-lg text-text-primary flex items-center justify-between">
          Issues
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="ml-2">
              {getAnnotatedCount()}/{violations.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddViolation}
              className="text-adani-primary hover:text-adani-primary/80 hover:bg-adani-primary/10 p-1 h-auto"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {violations.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">No violations added yet</p>
            <p className="text-text-muted text-xs mt-1">
              Click the + button to add violations
            </p>
          </div>
        ) : (
          violations.map((violation, index) => {
            const IconComponent = severityIconMap[violation.severity] || Info;
            const annotatedViolation = getAnnotatedViolation(index);
            const isAnnotated = !!annotatedViolation;

            return (
              <div
                key={index}
                className={`p-3 border rounded-lg space-y-2 transition-all duration-200 ${
                  isAnnotated
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-panel-border bg-hover-overlay/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStatusStyle(
                        violation.severity
                      )}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text-primary text-sm">
                          {violation.name}
                        </h4>
                        <Badge
                          className={`${getSeverityStatusStyle(
                            violation.severity
                          )} text-xs`}
                        >
                          {violation.severity}
                        </Badge>
                        {isAnnotated && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                            <Box className="w-3 h-3 mr-1" />
                            Annotated
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">
                        {violation.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveViolation(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 h-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {isAnnotated && annotatedViolation && (
                  <div className="text-xs text-text-muted">
                    Box: {Math.round(annotatedViolation.bbox.x * 100)}%,{" "}
                    {Math.round(annotatedViolation.bbox.y * 100)}% (
                    {Math.round(
                      annotatedViolation.bbox.width *
                        annotatedViolation.bbox.imageWidth
                    )}
                    x
                    {Math.round(
                      annotatedViolation.bbox.height *
                        annotatedViolation.bbox.imageHeight
                    )}
                    )
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
