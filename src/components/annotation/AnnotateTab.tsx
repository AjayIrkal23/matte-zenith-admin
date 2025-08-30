import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchImages, selectImages, selectImagesStatus } from "@/store/slices/imagesSlice";
import { submitAnnotatedImage } from "@/store/slices/annotatedImagesSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageCanvas from "./ImageCanvas";
import ViolationsList from "./ViolationsList";
import { IAnnotatedImage, IAnnotatedViolation, IBoundingBox } from "@/types/admin";

export default function AnnotateTab() {
  const dispatch = useAppDispatch();
  const images = useAppSelector(selectImages);
  const imagesStatus = useAppSelector(selectImagesStatus);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotatedViolations, setAnnotatedViolations] = useState<IAnnotatedViolation[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (imagesStatus === 'idle') {
      dispatch(fetchImages({ page: 1, pageSize: 100 })); // Load more images for annotation
    }
  }, [imagesStatus, dispatch]);

  useEffect(() => {
    // Reset annotations when switching images
    setAnnotatedViolations([]);
    setIsValidated(false);
  }, [currentImageIndex]);

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleAddAnnotation = (violation: IAnnotatedViolation) => {
    setAnnotatedViolations(prev => [...prev, violation]);
  };

  const handleRemoveAnnotation = (id: string) => {
    setAnnotatedViolations(prev => prev.filter(v => v.bbox.id !== id));
  };

  const handleSubmit = async () => {
    if (!currentImage) return;

    const annotatedImage: IAnnotatedImage = {
      ...currentImage,
      annotatedAt: new Date().toISOString(),
      annotatedBy: "current-user", // Replace with actual user ID
      validated: true,
      annotatedViolations,
    };

    try {
      await dispatch(submitAnnotatedImage(annotatedImage)).unwrap();
      toast({
        title: "Success",
        description: "Image annotation submitted successfully",
      });
      
      // Move to next image
      if (currentImageIndex < images.length - 1) {
        handleNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit annotation",
        variant: "destructive",
      });
    }
  };

  const checkIfAllViolationsAssigned = () => {
    if (!currentImage) return false;
    return currentImage.violations.length > 0 && 
           annotatedViolations.length >= currentImage.violations.length;
  };

  const isAllAssigned = checkIfAllViolationsAssigned();

  if (imagesStatus === 'loading' || !currentImage) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-adani-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentImageIndex === 0}
            className="btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Badge variant="secondary" className="px-3 py-1">
            {currentImageIndex + 1} of {images.length}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentImageIndex === images.length - 1}
            className="btn-secondary"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {isAllAssigned && (
            <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Assigned
            </Badge>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={annotatedViolations.length === 0}
            className="btn-adani"
          >
            <Save className="w-4 h-4 mr-2" />
            Submit Annotation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Canvas - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className={`glass-panel ${isAllAssigned ? 'border-green-500/30 bg-green-500/5' : ''}`}>
            <CardContent className="p-0">
              <ImageCanvas
                image={currentImage}
                annotations={annotatedViolations}
                onAddAnnotation={handleAddAnnotation}
                disabled={isAllAssigned}
              />
            </CardContent>
          </Card>
        </div>

        {/* Violations List - 1/3 width */}
        <div className="lg:col-span-1">
          <ViolationsList
            violations={annotatedViolations}
            onRemoveViolation={handleRemoveAnnotation}
          />
        </div>
      </div>
    </div>
  );
}