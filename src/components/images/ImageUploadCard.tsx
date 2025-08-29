import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { ImageUploadZone } from "./ImageUploadZone";
import { Progress } from "@/components/ui/progress";

interface ImageUploadCardProps {
  onZipUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  onZipUpload,
  isUploading,
  uploadProgress,
}) => (
  <Card className="glass-panel">
    <CardHeader>
      <CardTitle className="text-text-primary flex items-center gap-2">
        <Upload className="w-5 h-5 text-adani-primary" />
        Upload Images
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ImageUploadZone onZipUpload={onZipUpload} isUploading={isUploading} />
      {isUploading && uploadProgress > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Processing ZIP file...</span>
            <span className="text-adani-primary">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </CardContent>
  </Card>
);

export default ImageUploadCard;
