import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAnnotatedImages,
  selectAnnotatedImages,
  selectAnnotatedImagesStatus,
  selectAnnotatedImagesPagination,
} from "@/store/slices/annotatedImagesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User, Eye } from "lucide-react";
import { format } from "date-fns";
import ImageViewModal from "./ImageViewModal";
import { IAnnotatedImage } from "@/types/admin";

export default function AnnotatedListTab() {
  const dispatch = useAppDispatch();
  const annotatedImages = useAppSelector(selectAnnotatedImages);
  const status = useAppSelector(selectAnnotatedImagesStatus);
  const pagination = useAppSelector(selectAnnotatedImagesPagination);
  const [selectedImage, setSelectedImage] = useState<IAnnotatedImage | null>(
    null
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAnnotatedImages({ page: 1, pageSize: 20 }));
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-adani-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Loading annotated images...</p>
        </div>
      </div>
    );
  }

  if (annotatedImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-text-muted mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              No Annotated Images
            </h3>
            <p className="text-text-muted">
              Start annotating images in the Annotate tab
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Annotated Images
          </h3>
          <p className="text-text-muted">{pagination.total} images annotated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {annotatedImages.map((image) => (
          <Card key={image.id} className="glass-panel card-hover">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={image.imageURL}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Validated
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-primary truncate">
                {image.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div>
                {" "}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(image.annotatedAt), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <User className="w-3 h-3" />
                  {image.annotatedBy}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-text-primary">
                  Violations ({image.annotatedViolations.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {image.annotatedViolations
                    .slice(0, 3)
                    .map((violation, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {violation.name}
                      </Badge>
                    ))}
                  {image.annotatedViolations.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{image.annotatedViolations.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImage(image)}
                  className="w-full btn-secondary"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View Annotations
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image View Modal */}
      {selectedImage && (
        <ImageViewModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          annotatedImage={selectedImage}
        />
      )}
    </div>
  );
}
