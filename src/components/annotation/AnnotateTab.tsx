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
import { ViolationPicker } from "@/components/images/ViolationPicker";
import { IAnnotatedImage, IAnnotatedViolation, IViolation, IBoundingBox } from "@/types/admin";

export default function AnnotateTab() {
  const dispatch = useAppDispatch();
  const images = useAppSelector(selectImages);
  const imagesStatus = useAppSelector(selectImagesStatus);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageViolations, setCurrentImageViolations] = useState<IViolation[]>([]);
  const [annotatedViolations, setAnnotatedViolations] = useState<IAnnotatedViolation[]>([]);
  const [pendingBbox, setPendingBbox] = useState<(IBoundingBox & { imageWidth: number; imageHeight: number }) | null>(null);
  const [showViolationPicker, setShowViolationPicker] = useState(false);
  const [pickerStartInAdd, setPickerStartInAdd] = useState(false);

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (imagesStatus === 'idle') {
      dispatch(fetchImages({ page: 1, pageSize: 100 })); // Load more images for annotation
    }
  }, [imagesStatus, dispatch]);

  useEffect(() => {
    // Reset annotations and violations when switching images
    if (currentImage) {
      setCurrentImageViolations([...currentImage.violations]);
      setAnnotatedViolations([]);
      setPendingBbox(null);
      setShowViolationPicker(false);
    }
  }, [currentImageIndex, currentImage]);

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

  const handleAddViolation = () => {
    setPickerStartInAdd(true);
    setShowViolationPicker(true);
  };

  const handleRemoveViolation = (index: number) => {
    const violation = currentImageViolations[index];
    // Remove from violations list
    setCurrentImageViolations(prev => prev.filter((_, i) => i !== index));
    // Remove any associated annotation
    setAnnotatedViolations(prev => prev.filter(av => av.name !== violation.name));
  };

  const handleBoundingBoxDrawn = (bbox: IBoundingBox & { imageWidth: number; imageHeight: number }) => {
    setPickerStartInAdd(false);
    setPendingBbox(bbox);
    setShowViolationPicker(true);
  };

  const handleViolationSelected = (violation: IViolation) => {
    if (pendingBbox) {
      const annotatedViolation: IAnnotatedViolation = {
        ...violation,
        bbox: {
          id: pendingBbox.id,
          x: pendingBbox.x,
          y: pendingBbox.y,
          width: pendingBbox.width,
          height: pendingBbox.height,
          createdAt: pendingBbox.createdAt,
          createdBy: pendingBbox.createdBy,
        },
      };
      setAnnotatedViolations(prev => [...prev, annotatedViolation]);
      if (!currentImageViolations.some(v => v.name === violation.name)) {
        setCurrentImageViolations(prev => [...prev, violation]);
      }
      setPendingBbox(null);

      toast({
        title: "Violation Annotated",
        description: `${violation.name} has been annotated with bounding box (${pendingBbox.imageWidth}x${pendingBbox.imageHeight})`,
      });
    } else {
      setCurrentImageViolations(prev => [...prev, violation]);
    }
    setShowViolationPicker(false);
  };

  const handleSubmit = async () => {
    if (!currentImage) return;

    const annotatedImage: IAnnotatedImage = {
      ...currentImage,
      annotatedAt: new Date().toISOString(),
      annotatedBy: "current-user", // Replace with actual user ID
      validated: true,
      annotatedViolations,
      imageWidth: 640,  // Canvas dimensions for backend processing
      imageHeight: 480,
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
    if (currentImageViolations.length === 0) return false;
    return currentImageViolations.every(violation => 
      annotatedViolations.some(av => av.name === violation.name)
    );
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
            disabled={!isAllAssigned}
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
                onBoundingBoxDrawn={handleBoundingBoxDrawn}
                disabled={isAllAssigned}
              />
            </CardContent>
          </Card>
        </div>

        {/* Violations List - 1/3 width */}
        <div className="lg:col-span-1">
          <ViolationsList
            violations={currentImageViolations}
            annotatedViolations={annotatedViolations}
            onAddViolation={handleAddViolation}
            onRemoveViolation={handleRemoveViolation}
          />
        </div>
      </div>

      {/* Violation Picker Modal */}
      <ViolationPicker
        isOpen={showViolationPicker}
        onClose={() => {
          setShowViolationPicker(false);
          setPendingBbox(null);
          setPickerStartInAdd(false);
        }}
        onViolationSelected={handleViolationSelected}
        imageName={currentImage?.name || ""}
        violations={currentImageViolations}
        startInAdd={pickerStartInAdd}
      />
    </div>
  );
}