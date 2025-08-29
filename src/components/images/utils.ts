import { IImage } from "@/types/admin";


export const getSeverityBadgeStyle = (severity: string): string => {
  const map: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };
  return map[severity] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const getSeverityStatusStyle = (severity: string): string => {
  const map: Record<string, string> = {
    Critical: 'status-critical',
    High: 'status-high',
    Medium: 'status-medium',
    Low: 'status-low',
  };
  return map[severity] ?? 'bg-gray-500/20 text-gray-300';
};

export const formatFileSize = (bytes = 0, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatDate = (
  dateString?: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
): string => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const getPaginationRange = ({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}): number[] => {
  const maxPages = 5;
  let start = 1;

  if (totalPages > maxPages) {
    if (page <= 3) start = 1;
    else if (page >= totalPages - 2) start = totalPages - 4;
    else start = page - 2;
  }

  const end = Math.min(start + maxPages - 1, totalPages);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};
export const countViolationsBySeverity = (images: IImage[]) => {
  const counts: Record<string, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  images.forEach((image) => {
    image.violations.forEach((violation) => {
      counts[violation.severity]++;
    });
  });
  return counts;
};
