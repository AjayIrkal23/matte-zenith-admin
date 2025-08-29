import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, AlertTriangle, Filter, Eye, Calendar, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchImages, 
  uploadZip, 
  setPage,
  selectImages, 
  selectImagesStatus, 
  selectImagesError,
  selectImagesPagination,
  selectUploadProgress
} from '@/store/slices/imagesSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { ImageUploadZone } from '@/components/admin/ImageUploadZone';
import { ImageGrid } from '@/components/admin/ImageGrid';
import { ImageViewModal } from '@/components/admin/ImageViewModal';
import { IImage } from '@/types/admin';

export default function ImagesPage() {
  const dispatch = useAppDispatch();
  const images = useAppSelector(selectImages);
  const status = useAppSelector(selectImagesStatus);
  const error = useAppSelector(selectImagesError);
  const pagination = useAppSelector(selectImagesPagination);
  const uploadProgress = useAppSelector(selectUploadProgress);

  // Filters state
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  
  // Modal state  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchImages({ page: pagination.page, pageSize: pagination.pageSize }));
    }
  }, [status, dispatch, pagination.page, pagination.pageSize]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Filter images based on selected criteria
  const filteredImages = images.filter(image => {
    // Severity filter
    if (selectedSeverities.length > 0) {
      const hasMatchingSeverity = image.violations.some(v => 
        selectedSeverities.includes(v.severity)
      );
      if (!hasMatchingSeverity) return false;
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      const imageDate = new Date(image.uploadedAt);
      if (dateRange.from && imageDate < dateRange.from) return false;
      if (dateRange.to && imageDate > dateRange.to) return false;
    }

    return true;
  });

  const handleZipUpload = useCallback(async (file: File) => {
    try {
      await dispatch(uploadZip(file)).unwrap();
      toast({
        title: 'Success',
        description: `ZIP file processed successfully`,
      });
      // Refresh images after upload
      dispatch(fetchImages({ page: 1, pageSize: pagination.pageSize }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process ZIP file',
        variant: 'destructive',
      });
    }
  }, [dispatch, pagination.pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchImages({ page, pageSize: pagination.pageSize }));
  };

  const handleViewImage = (image: IImage) => {
    const imageIndex = filteredImages.findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex);
    setIsViewModalOpen(true);
  };

  const handleImageNavigation = (index: number) => {
    setCurrentImageIndex(index);
  };

  const severityOptions = ['Critical', 'High', 'Medium', 'Low'];

  const resetFilters = () => {
    setSelectedSeverities([]);
    setDateRange({});
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'status-critical';
      case 'High': return 'status-high';
      case 'Medium': return 'status-medium';
      case 'Low': return 'status-low';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTotalViolationsBySeverity = () => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    images.forEach(image => {
      image.violations.forEach(violation => {
        counts[violation.severity]++;
      });
    });
    return counts;
  };

  const violationStats = getTotalViolationsBySeverity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Images Management</h1>
          <p className="text-text-muted mt-1">Upload and review safety inspection images</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-adani-primary/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-adani-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Images</p>
                <p className="text-2xl font-bold text-text-primary">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.entries(violationStats).map(([severity, count]) => (
          <Card key={severity} className="glass-panel">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(severity)}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{severity}</p>
                  <p className="text-2xl font-bold text-text-primary">{count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedSeverities.join(',')} onValueChange={() => {}}>
              <SelectTrigger className="bg-hover-overlay/30 border-panel-border">
                <SelectValue placeholder="Filter by Severity" />
              </SelectTrigger>
              <SelectContent className="bg-panel-bg border-panel-border">
                {severityOptions.map(severity => (
                  <SelectItem 
                    key={severity} 
                    value={severity}
                    onClick={() => {
                      setSelectedSeverities(prev => 
                        prev.includes(severity) 
                          ? prev.filter(s => s !== severity)
                          : [...prev, severity]
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        severity === 'Critical' ? 'bg-red-500' :
                        severity === 'High' ? 'bg-orange-500' :
                        severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      {severity}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal bg-hover-overlay/30 border-panel-border">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'LLL dd')} - ${format(dateRange.to, 'LLL dd')}`
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    "Pick date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-panel-bg border-panel-border" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters} className="btn-secondary">
                <AlertCircle className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Upload className="w-5 h-5 text-adani-primary" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadZone 
            onZipUpload={handleZipUpload}
            isUploading={status === 'loading'}
          />
          {status === 'loading' && uploadProgress > 0 && (
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

      {/* Images Grid */}
      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-text-primary">
            Images Gallery ({filteredImages.length} of {pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && filteredImages.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-hover-overlay/30 rounded-lg animate-pulse shimmer" />
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

      {/* Image View Modal */}
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