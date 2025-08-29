import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileArchive, AlertCircle } from 'lucide-react';

interface ImageUploadZoneProps {
  onZipUpload: (file: File) => void;
  isUploading?: boolean;
}

export function ImageUploadZone({ onZipUpload, isUploading = false }: ImageUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const zipFile = acceptedFiles.find(file => file.type === 'application/zip' || file.name.endsWith('.zip'));
    if (zipFile) {
      onZipUpload(zipFile);
    }
  }, [onZipUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <motion.div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-adani-primary bg-adani-primary/10' 
          : 'border-panel-border hover:border-adani-primary/50 hover:bg-hover-overlay/30'
        }
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!isUploading ? { scale: 1.01 } : {}}
      whileTap={!isUploading ? { scale: 0.99 } : {}}
      onClick={getRootProps().onClick}
      onKeyDown={getRootProps().onKeyDown}
      tabIndex={getRootProps().tabIndex}
      role={getRootProps().role}
      style={getRootProps().style}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
          isDragActive 
            ? 'bg-adani-primary text-white' 
            : 'bg-adani-primary/20 text-adani-primary'
        }`}>
          {isUploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FileArchive className="w-8 h-8" />
            </motion.div>
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className={`text-lg font-semibold transition-colors ${
            isDragActive ? 'text-adani-primary' : 'text-text-primary'
          }`}>
            {isUploading 
              ? 'Processing ZIP file...' 
              : isDragActive 
                ? 'Drop ZIP file here' 
                : 'Upload ZIP Archive'
            }
          </h3>
          
          {!isUploading && (
            <p className="text-text-muted text-sm max-w-md mx-auto">
              Drag & drop a ZIP file containing images, or click to select. 
              Only ZIP files are supported.
            </p>
          )}
        </div>

        {!isUploading && (
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
            <AlertCircle className="w-4 h-4" />
            <span>Supported formats: .zip (containing .jpg, .png, .gif, .webp)</span>
          </div>
        )}
      </div>

      {isDragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-adani-primary/5 rounded-xl"
        />
      )}
    </motion.div>
  );
}