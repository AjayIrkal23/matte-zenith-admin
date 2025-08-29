import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, FileImage, Calendar, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { IImage } from '@/types/admin';

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
  onNavigate 
}: ImageViewModalProps) {
  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(nextIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

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
                <h2 className="font-semibold text-text-primary">{currentImage.name}</h2>
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
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
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
              {/* Image Info */}
              <Card className="glass-panel">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Folder className="w-4 h-4 text-text-muted" />
                    <span className="text-text-muted">Path:</span>
                  </div>
                  <code className="text-xs bg-hover-overlay/50 px-2 py-1 rounded block text-adani-primary font-mono">
                    {currentImage.imagePath}
                  </code>
                  
                  {currentImage.uploadedAt && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <span className="text-text-muted">Uploaded:</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {new Date(currentImage.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </>
                  )}

                  {currentImage.fileSize && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <FileImage className="w-4 h-4 text-text-muted" />
                        <span className="text-text-muted">Size:</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {(currentImage.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Violations */}
              <Card className="glass-panel">
                <CardContent className="p-4">
                  <h3 className="font-medium text-text-primary mb-4">
                    Violations ({currentImage.violations.length})
                  </h3>
                  
                  {currentImage.violations.length > 0 ? (
                    <div className="space-y-3">
                      {currentImage.violations.map((violation, index) => (
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
                            <Badge className={`text-xs ${getSeverityColor(violation.severity)}`}>
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
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileImage className="w-8 h-8 text-green-400" />
                      </div>
                      <p className="text-sm text-text-muted">No violations detected</p>
                      <p className="text-xs text-text-muted mt-1">This image appears to be compliant</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}