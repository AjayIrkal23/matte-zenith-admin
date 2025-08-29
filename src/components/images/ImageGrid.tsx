import { motion } from 'framer-motion';
import { Eye, AlertTriangle, Calendar, HardDrive } from 'lucide-react';
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
import { IImage } from '@/types/admin';
import {
  getSeverityStatusStyle,
  formatFileSize,
  formatDate,
  getPaginationRange,
} from './utils';

interface ImageGridProps {
  images: IImage[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  onPageChange: (page: number) => void;
  onViewImage: (image: IImage) => void;
}

export function ImageGrid({ images, pagination, onPageChange, onViewImage }: ImageGridProps) {
  const pages = getPaginationRange({ page: pagination.page, totalPages: pagination.totalPages });

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
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        onClick={() => onViewImage(image)}
                      >
                        <Eye className="w-4 h-4" />
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
                          </div>
                          <div className="space-y-1">
                            {image.violations.slice(0, 2).map((violation, idx) => (
                              <Badge
                                key={idx}
                                className={`text-xs px-2 py-1 ${getSeverityStatusStyle(violation.severity)}`}
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

                  {pages.map((pageNum) => (
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
                  ))}

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