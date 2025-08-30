import { useState, useRef, useCallback } from "react";
import { IImage, IAnnotatedViolation, IBoundingBox, IViolation } from "@/types/admin";
import { ViolationPicker } from "@/components/images/ViolationPicker";

interface ImageCanvasProps {
  image: IImage;
  annotations: IAnnotatedViolation[];
  onAddAnnotation: (annotation: IAnnotatedViolation) => void;
  disabled?: boolean;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentBox: { x: number; y: number; width: number; height: number } | null;
}

export default function ImageCanvas({ image, annotations, onAddAnnotation, disabled }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentBox: null,
  });
  const [showViolationPicker, setShowViolationPicker] = useState(false);
  const [pendingBox, setPendingBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setDrawingState({
      isDrawing: true,
      startX: x,
      startY: y,
      currentBox: null,
    });
  }, [disabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drawingState.isDrawing || disabled) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const box = {
      x: Math.min(drawingState.startX, x),
      y: Math.min(drawingState.startY, y),
      width: Math.abs(x - drawingState.startX),
      height: Math.abs(y - drawingState.startY),
    };

    setDrawingState(prev => ({ ...prev, currentBox: box }));
  }, [drawingState.isDrawing, drawingState.startX, drawingState.startY, disabled]);

  const handleMouseUp = useCallback(() => {
    if (!drawingState.isDrawing || !drawingState.currentBox || disabled) return;

    // Only show picker if box is large enough
    if (drawingState.currentBox.width > 0.02 && drawingState.currentBox.height > 0.02) {
      setPendingBox(drawingState.currentBox);
      setShowViolationPicker(true);
    }

    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentBox: null,
    });
  }, [drawingState.isDrawing, drawingState.currentBox, disabled]);

  const handleViolationSelected = (violation: IViolation) => {
    if (!pendingBox) return;

    const bbox: IBoundingBox = {
      id: `bbox-${Date.now()}`,
      x: pendingBox.x,
      y: pendingBox.y,
      width: pendingBox.width,
      height: pendingBox.height,
      createdAt: new Date().toISOString(),
      createdBy: "current-user", // Replace with actual user ID
    };

    const annotatedViolation: IAnnotatedViolation = {
      ...violation,
      bbox,
    };

    onAddAnnotation(annotatedViolation);
    setShowViolationPicker(false);
    setPendingBox(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'border-red-500 bg-red-500/20';
      case 'High': return 'border-orange-500 bg-orange-500/20';
      case 'Medium': return 'border-yellow-500 bg-yellow-500/20';
      case 'Low': return 'border-blue-500 bg-blue-500/20';
      default: return 'border-gray-500 bg-gray-500/20';
    }
  };

  return (
    <>
      <div className="relative w-full">
        <div
          ref={canvasRef}
          className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${
            disabled ? 'cursor-not-allowed' : 'cursor-crosshair'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Image */}
          <img
            src={image.imageURL}
            alt={image.name}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Existing annotations */}
          {annotations.map((annotation) => (
            <div
              key={annotation.bbox.id}
              className={`absolute border-2 ${getSeverityColor(annotation.severity)} pointer-events-none`}
              style={{
                left: `${annotation.bbox.x * 100}%`,
                top: `${annotation.bbox.y * 100}%`,
                width: `${annotation.bbox.width * 100}%`,
                height: `${annotation.bbox.height * 100}%`,
              }}
            >
              <div className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium rounded ${getSeverityColor(annotation.severity)}`}>
                {annotation.name}
              </div>
            </div>
          ))}

          {/* Current drawing box */}
          {drawingState.currentBox && (
            <div
              className="absolute border-2 border-adani-primary bg-adani-primary/20 pointer-events-none"
              style={{
                left: `${drawingState.currentBox.x * 100}%`,
                top: `${drawingState.currentBox.y * 100}%`,
                width: `${drawingState.currentBox.width * 100}%`,
                height: `${drawingState.currentBox.height * 100}%`,
              }}
            />
          )}

          {/* Disabled overlay */}
          {disabled && (
            <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
              <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30">
                All violations assigned - Image locked
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!disabled && (
          <p className="text-xs text-text-muted mt-2 text-center">
            Click and drag to draw bounding boxes around violations
          </p>
        )}
      </div>

      <ViolationPicker
        isOpen={showViolationPicker}
        onClose={() => {
          setShowViolationPicker(false);
          setPendingBox(null);
        }}
        onViolationSelected={handleViolationSelected}
        imageName={image.name}
      />
    </>
  );
}
