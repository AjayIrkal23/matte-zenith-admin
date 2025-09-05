import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { IViolation } from "@/types/admin";
import { getSeverityStatusStyle } from "./utils";
import type { ElementType } from "react";

interface ViolationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onViolationSelected: (violation: IViolation) => void;
  imageName: string;
  violations: IViolation[];
  startInAdd?: boolean;
}

const severityIconMap: Record<string, ElementType> = {
  Critical: AlertTriangle,
  High: Shield,
  Medium: AlertCircle,
  Low: Info,
};
export function ViolationPicker({
  isOpen,
  onClose,
  onViolationSelected,
  imageName,
  violations,
  startInAdd = false,
}: ViolationPickerProps) {
  const [isAdding, setIsAdding] = useState(startInAdd);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IViolation["severity"]>("Low");

  useEffect(() => {
    if (startInAdd) setIsAdding(true);
  }, [startInAdd]);

  useEffect(() => {
    if (!isOpen) {
      setIsAdding(startInAdd);
      resetForm();
    }
  }, [isOpen, startInAdd]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSeverity("Low");
  };

  const handleSubmit = () => {
    onViolationSelected({ name, description, severity });
    resetForm();
    setIsAdding(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-panel-bg border-panel-border">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            {isAdding ? "Add New Violation" : "Assign Violation"}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {isAdding
              ? "Provide details for the new violation"
              : `Select a violation to assign to "${imageName}"`}
          </DialogDescription>
        </DialogHeader>

        {isAdding ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="violation-name"
                className="text-text-primary text-sm font-medium"
              >
                Name
              </Label>
              <Input
                id="violation-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-panel-bg border-panel-border"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="violation-desc"
                className="text-text-primary text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="violation-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-panel-bg border-panel-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary text-sm font-medium">
                Severity
              </Label>
              <Select
                value={severity}
                onValueChange={(v) => setSeverity(v as IViolation["severity"])}
              >
                <SelectTrigger className="bg-panel-bg border-panel-border">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-panel-bg border-panel-border">
                  {Object.keys(severityIconMap).map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="text-text-primary hover:bg-hover-overlay"
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAdding(false);
                }}
                className="btn-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name || !description}
                className="btn-adani"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-3 py-4"
              >
                {violations.map((violation, index) => {
                  const IconComponent =
                    severityIconMap[violation.severity] || Info;

                  return (
                    <motion.div
                      key={`${violation.name}-${index}`}
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
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityStatusStyle(
                              violation.severity
                            )}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 text-left space-y-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-text-primary">
                                {violation.name}
                              </h4>
                              <Badge
                                className={`${getSeverityStatusStyle(
                                  violation.severity
                                )} text-xs`}
                              >
                                {violation.severity}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-wrap text-text-muted">
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

            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsAdding(true)}
                className="text-adani-primary hover:bg-adani-primary/10"
              >
                Add New Violation
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
