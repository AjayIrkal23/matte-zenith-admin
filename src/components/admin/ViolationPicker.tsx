import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { IViolation } from '@/types/admin';

interface ViolationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onViolationSelected: (violation: IViolation) => void;
  imageName: string;
}

const availableViolations: IViolation[] = [
  {
    name: "Helmet Missing",
    description: "Worker without helmet in construction zone",
    severity: "Critical"
  },
  {
    name: "Fire Hazard",
    description: "Unattended flame near combustible materials", 
    severity: "High"
  },
  {
    name: "Dust",
    description: "Area has dust accumulation",
    severity: "Medium"
  },
  {
    name: "Parking",
    description: "No-parking zone violation",
    severity: "Low"
  }
];

export function ViolationPicker({ isOpen, onClose, onViolationSelected, imageName }: ViolationPickerProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return AlertTriangle;
      case 'High': return Shield;
      case 'Medium': return AlertCircle;
      case 'Low': return Info;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'status-critical';
      case 'High': return 'status-high';
      case 'Medium': return 'status-medium';
      case 'Low': return 'status-low';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-panel-bg border-panel-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Assign Violation
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Select a violation to assign to "{imageName}"
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-3 py-4"
          >
            {availableViolations.map((violation, index) => {
              const IconComponent = getSeverityIcon(violation.severity);
              
              return (
                <motion.div
                  key={violation.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-4 justify-start hover:bg-hover-overlay border border-panel-border hover:border-adani-primary/50 transition-all duration-200"
                    onClick={() => onViolationSelected(violation)}
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(violation.severity)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-text-primary">
                            {violation.name}
                          </h4>
                          <Badge className={`${getSeverityColor(violation.severity)} text-xs`}>
                            {violation.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-muted">
                          {violation.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose} className="btn-secondary">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}