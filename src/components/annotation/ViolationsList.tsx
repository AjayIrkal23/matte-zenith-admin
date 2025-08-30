import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, Shield, AlertCircle, Info } from "lucide-react";
import { IAnnotatedViolation } from "@/types/admin";
import { getSeverityStatusStyle } from "@/components/images/utils";
import type { ElementType } from 'react';

interface ViolationsListProps {
  violations: IAnnotatedViolation[];
  onRemoveViolation: (id: string) => void;
}

const severityIconMap: Record<string, ElementType> = {
  Critical: AlertTriangle,
  High: Shield,
  Medium: AlertCircle,
  Low: Info,
};

export default function ViolationsList({ violations, onRemoveViolation }: ViolationsListProps) {
  return (
    <Card className="glass-panel h-fit">
      <CardHeader>
        <CardTitle className="text-lg text-text-primary flex items-center justify-between">
          Issues
          <Badge variant="secondary" className="ml-2">
            {violations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {violations.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">
              No violations annotated yet
            </p>
            <p className="text-text-muted text-xs mt-1">
              Draw bounding boxes on the image to add violations
            </p>
          </div>
        ) : (
          violations.map((violation) => {
            const IconComponent = severityIconMap[violation.severity] || Info;
            
            return (
              <div
                key={violation.bbox.id}
                className="p-3 border border-panel-border rounded-lg bg-hover-overlay/30 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStatusStyle(violation.severity)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text-primary text-sm">
                          {violation.name}
                        </h4>
                        <Badge className={`${getSeverityStatusStyle(violation.severity)} text-xs`}>
                          {violation.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {violation.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveViolation(violation.bbox.id)}
                    className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-xs text-text-muted">
                  Box: {Math.round(violation.bbox.x * 100)}%, {Math.round(violation.bbox.y * 100)}%
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}