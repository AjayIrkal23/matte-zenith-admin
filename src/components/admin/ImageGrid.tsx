import { motion } from 'framer-motion';
import { Eye, Plus, AlertTriangle, Calendar, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { IImage, PaginatedResponse } from '@/types/admin';

interface ImageGridProps {
  images: IImage[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onAssignViolation: (image: IImage) => void;
}

export function ImageGrid({ images, pagination, onPageChange, onAssignViolation }: ImageGridProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'status-critical';
      case 'High': return 'status-high';
      case 'Medium': return 'status-medium';
      case 'Low': return 'status-low';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-adani-primary/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-adani-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Images Found</h3>
          <p className="text-text-muted">Upload a ZIP file to get started with image management.</p>
        </div>
      ) : (
        <>
          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="glass-panel card-hover overflow-hidden">
                  <div className="relative aspect-video bg-hover-overlay/20">
                    <img
                      src={image.imageURL}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay with quick actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-adani-primary/80 hover:bg-adani-primary text-white"
                        onClick={() => onAssignViolation(image)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Image Info */}
                    <div>
                      <h4 className="font-semibold text-text-primary text-sm truncate" title={image.name}>
                        {image.name}
                      </h4>
                      <p className="text-xs text-text-muted truncate" title={image.imagePath}>
                        {image.imagePath}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(image.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{formatFileSize(image.fileSize)}</span>
                      </div>
                    </div>

                    {/* Violations */}
                    <div className="space-y-2">
                      {image.violations.length > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-muted">Violations ({image.violations.length})</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2 text-xs text-adani-primary hover:text-adani-primary hover:bg-adani-primary/10"
                              onClick={() => onAssignViolation(image)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="space-y-1">
                            {image.violations.slice(0, 2).map((violation, idx) => (
                              <Badge
                                key={idx}
                                className={`text-xs px-2 py-1 ${getSeverityColor(violation.severity)}`}
                              >
                                {violation.name}
                              </Badge>
                            ))}
                            {image.violations.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                +{image.violations.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <span className="text-xs text-text-muted">No violations detected</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="ml-2 h-6 px-2 text-xs text-adani-primary hover:text-adani-primary hover:bg-adani-primary/10"
                            onClick={() => onAssignViolation(image)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Violation
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) {
                          onPageChange(pagination.page - 1);
                        }
                      }}
                      className={`${
                        pagination.page <= 1 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-hover-overlay text-text-primary'
                      }`}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (pagination.totalPages > 5) {
                      if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                          }}
                          className={`${
                            pageNum === pagination.page
                              ? 'bg-adani-primary text-white'
                              : 'hover:bg-hover-overlay text-text-primary'
                          }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page < pagination.totalPages) {
                          onPageChange(pagination.page + 1);
                        }
                      }}
                      className={`${
                        pagination.page >= pagination.totalPages 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-hover-overlay text-text-primary'
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}