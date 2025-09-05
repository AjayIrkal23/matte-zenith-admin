import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { IAnnotatedImage } from "@/types/admin";
import { getSeverityStatusStyle, getSeverityBorderColor } from "@/components/images/utils";

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  annotatedImage: IAnnotatedImage;
}

export default function ImageViewModal({ isOpen, onClose, annotatedImage }: ImageViewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-panel-bg border-panel-border">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-text-primary flex items-center gap-3">
              {annotatedImage.name}
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Annotated
              </Badge>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-text-muted min-w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto relative">
          <div
            className="relative mx-auto"
            style={{
              width: annotatedImage.imageWidth,
              height: annotatedImage.imageHeight,
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'top left',
            }}
          >
            <img
              src={annotatedImage.imageURL}
              alt={annotatedImage.name}
              className="w-full h-full object-contain"
              draggable={false}
            />

            {/* Bounding boxes overlay */}
            {annotatedImage.annotatedViolations.map((violation, index) => (
              <motion.div
                key={violation.bbox.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className={`absolute border-2 ${getSeverityBorderColor(violation.severity)} bg-transparent pointer-events-none`}
                style={{
                  left: `${violation.bbox.x * 100}%`,
                  top: `${violation.bbox.y * 100}%`,
                  width: `${violation.bbox.width * 100}%`,
                  height: `${violation.bbox.height * 100}%`,
                }}
              >
                <div className="absolute -top-8 left-0 bg-panel-bg/90 backdrop-blur-sm border border-panel-border rounded px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary">
                      {violation.name}
                    </span>
                    <Badge className={`${getSeverityStatusStyle(violation.severity)} text-xs`}>
                      {violation.severity}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Violations Summary */}
        <div className="border-t border-panel-border pt-4">
          <div className="flex flex-wrap gap-2">
            {annotatedImage.annotatedViolations.map((violation, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs"
              >
                {violation.name} - {violation.severity}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}