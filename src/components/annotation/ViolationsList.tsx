import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, Shield, AlertCircle, Info, Plus, Box } from "lucide-react";
import { IViolation, IAnnotatedViolation } from "@/types/admin";
import { getSeverityStatusStyle } from "@/components/images/utils";
import type { ElementType } from 'react';

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

export default function ViolationsList({ violations, annotatedViolations, onAddViolation, onRemoveViolation }: ViolationsListProps) {
  const getAnnotatedViolation = (violationIndex: number) => {
    return annotatedViolations.find(av => av.name === violations[violationIndex]?.name);
  };

  const getAnnotatedCount = () => {
    return violations.filter((_, index) => getAnnotatedViolation(index)).length;
  };

  return (
    <Card className="glass-panel h-fit sticky top-4">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg text-text-primary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Issues</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm flex-shrink-0">
                {getAnnotatedCount()}/{violations.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddViolation}
                className="text-adani-primary hover:text-adani-primary/80 hover:bg-adani-primary/10 p-1 h-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Add</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto">
        {violations.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-text-muted mx-auto mb-2 sm:mb-3" />
            <p className="text-text-muted text-sm">
              No violations added yet
            </p>
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
                className={`p-2 sm:p-3 border rounded-lg space-y-2 transition-all duration-200 ${
                  isAnnotated 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-panel-border bg-hover-overlay/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStatusStyle(violation.severity)}`}>
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <h4 className="font-medium text-text-primary text-sm leading-tight">
                          {violation.name}
                        </h4>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Badge className={`${getSeverityStatusStyle(violation.severity)} text-xs flex-shrink-0`}>
                            {violation.severity}
                          </Badge>
                          {isAnnotated && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs flex-shrink-0">
                              <Box className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Annotated</span>
                              <span className="sm:hidden">Done</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                        {violation.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveViolation(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 h-6 w-6 sm:h-auto flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {isAnnotated && annotatedViolation && (
                  <div className="text-xs text-text-muted pl-8 sm:pl-11">
                    <span className="hidden sm:inline">Box: {Math.round(annotatedViolation.bbox.x * 100)}%, {Math.round(annotatedViolation.bbox.y * 100)}%</span>
                    <span className="sm:hidden">({Math.round(annotatedViolation.bbox.x * 100)}%, {Math.round(annotatedViolation.bbox.y * 100)}%)</span>
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