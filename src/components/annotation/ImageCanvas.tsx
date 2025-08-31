import { useState, useRef, useCallback } from "react";
import { IImage, IAnnotatedViolation, IBoundingBox } from "@/types/admin";

interface ImageCanvasProps {
  image: IImage;
  annotations: IAnnotatedViolation[];
  onBoundingBoxDrawn: (
    bbox: IBoundingBox & { imageWidth: number; imageHeight: number }
  ) => void;
  disabled?: boolean;
  width: number;
  height: number;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentBox: { x: number; y: number; width: number; height: number } | null;
}

export default function ImageCanvas({
  image,
  annotations,
  onBoundingBoxDrawn,
  disabled = false,
  width,
  height,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentBox: null,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
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

      setDrawingState((prev) => ({ ...prev, currentBox: box }));
    },
    [drawingState.isDrawing, drawingState.startX, drawingState.startY, disabled]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawingState.isDrawing || !drawingState.currentBox || disabled) return;

    // Only create bounding box if it has meaningful size
    if (
      drawingState.currentBox.width > 0.02 &&
      drawingState.currentBox.height > 0.02
    ) {
      const boundingBox: IBoundingBox & {
        imageWidth: number;
        imageHeight: number;
      } = {
        id: `bbox-${Date.now()}`,
        x: drawingState.currentBox.x,
        y: drawingState.currentBox.y,
        width: drawingState.currentBox.width,
        height: drawingState.currentBox.height,
        createdAt: new Date().toISOString(),
        createdBy: "current-user", // Replace with actual user ID
        imageWidth: width,
        imageHeight: height,
      };

      onBoundingBoxDrawn(boundingBox);
    }

    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentBox: null,
    });
  }, [
    drawingState.isDrawing,
    drawingState.currentBox,
    disabled,
    onBoundingBoxDrawn,
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "border-red-500 bg-red-500/20";
      case "High":
        return "border-orange-500 bg-orange-500/20";
      case "Medium":
        return "border-yellow-500 bg-yellow-500/20";
      case "Low":
        return "border-blue-500 bg-blue-500/20";
      default:
        return "border-gray-500 bg-gray-500/20";
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={canvasRef}
        className={`relative bg-black rounded-lg mx-auto overflow-hidden ${
          disabled ? "cursor-not-allowed" : "cursor-crosshair"
        }`}
        style={{ width, height }}
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
            className={`absolute border-2 ${getSeverityColor(
              annotation.severity
            )} pointer-events-none`}
            style={{
              left: `${annotation.bbox.x * 100}%`,
              top: `${annotation.bbox.y * 100}%`,
              width: `${annotation.bbox.width * 100}%`,
              height: `${annotation.bbox.height * 100}%`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-panel-bg/90 backdrop-blur-sm border border-panel-border rounded px-2 py-1">
              <span className="text-xs font-medium text-text-primary">
                {annotation.name}
              </span>
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

        {/* Instructions */}
        {!disabled && (
          <div className="absolute bottom-4 left-4 bg-panel-bg/90 backdrop-blur-sm border border-panel-border rounded-lg px-3 py-2">
            <p className="text-xs text-text-muted">
              Draw a bounding box to annotate
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
