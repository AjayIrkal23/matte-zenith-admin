import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAnnotationCandidates,
  selectAnnotationCandidates,
  selectAnnotationCandidatesStatus,
} from "@/store/slices/annotationCandidatesSlice";
import { submitAnnotatedImage } from "@/store/slices/annotatedImagesSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageCanvas from "./ImageCanvas";
import ViolationsList from "./ViolationsList";
import { ViolationPicker } from "@/components/images/ViolationPicker";
import {
  IAnnotatedImage,
  IAnnotatedViolation,
  IViolation,
  IBoundingBox,
} from "@/types/admin";

export default function AnnotateTab() {
  const dispatch = useAppDispatch();
  const allImages = useAppSelector(selectAnnotationCandidates);
  const imagesStatus = useAppSelector(selectAnnotationCandidatesStatus);

  // Candidates from backend are already filtered to AI validated images
  const aiValidatedImages = allImages;
  
  // Batch management state
  const [currentBatch, setCurrentBatch] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageViolations, setCurrentImageViolations] = useState<
    IViolation[]
  >([]);
  const [annotatedViolations, setAnnotatedViolations] = useState<
    IAnnotatedViolation[]
  >([]);
  const [pendingBbox, setPendingBbox] = useState<IBoundingBox | null>(null);
  const [showViolationPicker, setShowViolationPicker] = useState(false);
  const [pickerStartInAdd, setPickerStartInAdd] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 704, height: 528 });
  const [zoom, setZoom] = useState(1);

  // Constants for batching
  const BATCH_SIZE = 10;
  const startIndex = currentBatch * BATCH_SIZE;
  const endIndex = Math.min(startIndex + BATCH_SIZE, aiValidatedImages.length);
  const currentBatchImages = aiValidatedImages.slice(startIndex, endIndex);
  const totalBatches = Math.ceil(aiValidatedImages.length / BATCH_SIZE);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const currentImage = currentBatchImages[currentImageIndex];

  useEffect(() => {
    if (imagesStatus === "idle") {
      dispatch(
        fetchAnnotationCandidates({ page: 1, pageSize: 100, onlyValidated: true })
      );
    }
  }, [imagesStatus, dispatch]);

  // Reset current image index when batch changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentBatch]);

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
    if (currentImageIndex < currentBatchImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleNextBatch = () => {
    if (currentBatch < totalBatches - 1) {
      setCurrentBatch(currentBatch + 1);
    }
  };

  const handlePreviousBatch = () => {
    if (currentBatch > 0) {
      setCurrentBatch(currentBatch - 1);
    }
  };

  const handleAddViolation = () => {
    setPickerStartInAdd(true);
    setShowViolationPicker(true);
  };

  const handleRemoveViolation = (index: number) => {
    const violation = currentImageViolations[index];
    // Remove from violations list
    setCurrentImageViolations((prev) => prev.filter((_, i) => i !== index));
    // Remove any associated annotation
    setAnnotatedViolations((prev) =>
      prev.filter((av) => av.name !== violation.name)
    );
  };

  const handleBoundingBoxDrawn = (bbox: IBoundingBox) => {
    setPickerStartInAdd(false);
    setPendingBbox(bbox);
    setShowViolationPicker(true);
  };

  const handleViolationSelected = (violation: IViolation) => {
    if (pendingBbox) {
      const annotatedViolation: IAnnotatedViolation = {
        ...violation,
        bbox: { ...pendingBbox },
      };
      setAnnotatedViolations((prev) => [...prev, annotatedViolation]);
      if (!currentImageViolations.some((v) => v.name === violation.name)) {
        setCurrentImageViolations((prev) => [...prev, violation]);
      }
      setPendingBbox(null);

      toast({
        title: "Violation Annotated",
        description: `${violation.name} has been annotated with bounding box (${pendingBbox.imageWidth}x${pendingBbox.imageHeight})`,
      });
    } else {
      setCurrentImageViolations((prev) => [...prev, violation]);
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
      imageWidth: canvasSize.width,
      imageHeight: canvasSize.height,
      usersValidated: [], // Empty array, will be updated in backend when users play
    };

    try {
      await dispatch(submitAnnotatedImage(annotatedImage)).unwrap();
      toast({
        title: "Success",
        description: "Image annotation submitted successfully",
      });

      // Move to next image or batch
      if (currentImageIndex < currentBatchImages.length - 1) {
        handleNext();
      } else if (currentBatch < totalBatches - 1) {
        handleNextBatch();
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
    return currentImageViolations.every((violation) =>
      annotatedViolations.some((av) => av.name === violation.name)
    );
  };

  const isAllAssigned = checkIfAllViolationsAssigned();

  if (imagesStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-adani-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Loading images...</p>
        </div>
      </div>
    );
  }

  if (aiValidatedImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-panel-bg border-2 border-panel-border rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No AI Validated Images</h3>
            <p className="text-text-muted">
              There are no AI validated images available for annotation yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-panel-bg border-2 border-panel-border rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Batch Complete</h3>
            <p className="text-text-muted">
              All images in this batch have been processed.
            </p>
          </div>
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

          <div className="flex flex-col items-center gap-1">
            <Badge variant="secondary" className="px-3 py-1">
              {currentImageIndex + 1} of {currentBatchImages.length}
            </Badge>
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              Batch {currentBatch + 1} of {totalBatches}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentImageIndex === currentBatchImages.length - 1}
            className="btn-secondary"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>

          {currentImageIndex === currentBatchImages.length - 1 && currentBatch < totalBatches - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextBatch}
              className="btn-adani"
            >
              Next Batch
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {currentBatch > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousBatch}
              className="btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Batch
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAllAssigned && (
            <Badge
              variant="default"
              className="bg-green-500/20 text-green-300 border-green-500/30"
            >
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

      <p className="text-sm text-text-muted">
        Image size: {canvasSize.width}x{canvasSize.height}
      </p>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Canvas - 2/3 width */}
        <div className="lg:col-span-2">
          <Card
            className={`glass-panel ${
              isAllAssigned ? "border-green-500/30 bg-green-500/5" : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-panel-bg/80 backdrop-blur-sm border border-panel-border rounded-md p-1">
                  <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-text-muted min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleResetZoom}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <ImageCanvas
                  image={currentImage}
                  annotations={annotatedViolations}
                  onBoundingBoxDrawn={handleBoundingBoxDrawn}
                  disabled={isAllAssigned}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  zoom={zoom}
                />
              </div>
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
