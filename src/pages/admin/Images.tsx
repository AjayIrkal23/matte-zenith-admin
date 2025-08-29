import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchImages,
  uploadZip,
  setPage,
  selectImages,
  selectImagesStatus,
  selectImagesError,
  selectImagesPagination,
  selectUploadProgress,
} from "@/store/slices/imagesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ImageGrid } from "@/components/images/ImageGrid";
import { ImageViewModal } from "@/components/images/ImageViewModal";
import { ImageUploadCard } from "@/components/images/ImageUploadCard";
import { ImageFilters } from "@/components/images/ImageFilters";
import { ImageStats } from "@/components/images/ImageStats";
import { countViolationsBySeverity } from "@/components/images/utils";
import { IImage } from "@/types/admin";

export default function ImagesPage() {
  const dispatch = useAppDispatch();
  const images = useAppSelector(selectImages);
  const status = useAppSelector(selectImagesStatus);
  const error = useAppSelector(selectImagesError);
  const pagination = useAppSelector(selectImagesPagination);
  const uploadProgress = useAppSelector(selectUploadProgress);

  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (status === "idle") {
      dispatch(
        fetchImages({ page: pagination.page, pageSize: pagination.pageSize })
      );
    }
  }, [status, dispatch, pagination.page, pagination.pageSize]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const severityOptions = useMemo(() => ["Critical", "High", "Medium", "Low"], []);

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      if (selectedSeverities.length > 0) {
        const hasMatchingSeverity = image.violations.some((v) =>
          selectedSeverities.includes(v.severity)
        );
        if (!hasMatchingSeverity) return false;
      }
      if (dateRange.from || dateRange.to) {
        const imageDate = new Date(image.uploadedAt);
        if (dateRange.from && imageDate < dateRange.from) return false;
        if (dateRange.to && imageDate > dateRange.to) return false;
      }
      return true;
    });
  }, [images, selectedSeverities, dateRange]);

  const violationStats = useMemo(
    () => countViolationsBySeverity(images),
    [images]
  );

  const handleZipUpload = useCallback(
    async (file: File) => {
      try {
        await dispatch(uploadZip(file)).unwrap();
        toast({
          title: "Success",
          description: `ZIP file processed successfully`,
        });
        dispatch(fetchImages({ page: 1, pageSize: pagination.pageSize }));
      } catch {
        toast({
          title: "Error",
          description: "Failed to process ZIP file",
          variant: "destructive",
        });
      }
    },
    [dispatch, pagination.pageSize]
  );

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchImages({ page, pageSize: pagination.pageSize }));
  };

  const handleViewImage = (image: IImage) => {
    const imageIndex = filteredImages.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(imageIndex);
    setIsViewModalOpen(true);
  };

  const handleImageNavigation = (index: number) => {
    setCurrentImageIndex(index);
  };

  const resetFilters = () => {
    setSelectedSeverities([]);
    setDateRange({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Images Management
          </h1>
          <p className="text-text-muted mt-1">
            Upload and review safety inspection images
          </p>
        </div>
      </div>

      <ImageStats
        totalImages={pagination.total}
        violationStats={violationStats}
      />

      <ImageFilters
        selectedSeverities={selectedSeverities}
        onToggleSeverity={(severity) =>
          setSelectedSeverities((prev) =>
            prev.includes(severity)
              ? prev.filter((s) => s !== severity)
              : [...prev, severity]
          )
        }
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        severityOptions={severityOptions}
        onReset={resetFilters}
      />

      <ImageUploadCard
        onZipUpload={handleZipUpload}
        isUploading={status === "loading"}
        uploadProgress={uploadProgress}
      />

      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-text-primary">
            Images Gallery ({filteredImages.length} of {pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && filteredImages.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-video bg-hover-overlay/30 rounded-lg animate-pulse shimmer"
                />
              ))}
            </div>
          ) : (
            <ImageGrid
              images={filteredImages}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewImage={handleViewImage}
            />
          )}
        </CardContent>
      </Card>

      <ImageViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        images={filteredImages}
        currentIndex={currentImageIndex}
        onNavigate={handleImageNavigation}
      />
    </motion.div>
  );
}
