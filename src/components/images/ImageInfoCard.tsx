import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileImage, Folder } from "lucide-react";
import { IImage } from "@/types/admin";
import { formatDate, formatFileSize } from "./utils";

interface ImageInfoCardProps {
  image: IImage;
}

export function ImageInfoCard({ image }: ImageInfoCardProps) {
  // Normalize any Windows-style backslashes to forward slashes
  const normalizedPath = image.imagePath?.replace(/\\/g, "/");

  return (
    <Card className="glass-panel">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Folder className="w-4 h-4 text-text-muted" />
          <span className="text-text-muted">Path:</span>
        </div>
        <code className="text-xs bg-hover-overlay/50 px-2 py-1 rounded block text-adani-primary font-mono break-all">
          {normalizedPath}
        </code>

        {image.uploadedAt && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span className="text-text-muted">Uploaded:</span>
            </div>
            <p className="text-sm text-text-secondary">
              {formatDate(image.uploadedAt, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        )}

        {image.fileSize && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <FileImage className="w-4 h-4 text-text-muted" />
              <span className="text-text-muted">Size:</span>
            </div>
            <p className="text-sm text-text-secondary">
              {formatFileSize(image.fileSize, 1)}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
