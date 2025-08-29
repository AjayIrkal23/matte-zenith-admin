import { useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, FileImage } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IImage } from "@/types/admin";
import { ImageInfoCard } from "./ImageInfoCard";
import { ViolationsList } from "./ViolationsList";

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: IImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function ImageViewModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: ImageViewModalProps) {
  const currentImage = useMemo(() => images[currentIndex], [images, currentIndex]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(prevIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(nextIndex);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0 bg-panel-bg border-panel-border overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-panel-border">
            <div className="flex items-center gap-3">
              <FileImage className="w-5 h-5 text-adani-primary" />
              <div>
                <h2 className="font-semibold text-text-primary">
                  {currentImage.name}
                </h2>
                <p className="text-sm text-text-muted">
                  {currentIndex + 1} of {images.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary focus-ring"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Image Display */}
            <div className="flex-1 relative bg-app-bg flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage.id}
                  src={currentImage.imageURL}
                  alt={currentImage.name}
                  className=" object-cover rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.22 }}
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-panel-bg/80 backdrop-blur-sm border-panel-border hover:bg-panel-bg focus-ring"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-panel-bg/80 backdrop-blur-sm border-panel-border hover:bg-panel-bg focus-ring"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-panel-border bg-panel-bg/50 p-4 space-y-4">
              <ImageInfoCard image={currentImage} />
              <ViolationsList violations={currentImage.violations} />
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
