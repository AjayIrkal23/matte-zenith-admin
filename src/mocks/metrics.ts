// Metrics mock data for dashboard charts and KPIs

export interface MonthlyData {
  month: string;
  users: number;
  totalImages: number;
  validatedImages: number;
}

export interface AiHumanMetrics {
  aiAvgSec: number;
  humanAvgSec: number;
  deltaAvgSec: number;
}

// Last 12 months of data
export const monthlyMetrics: MonthlyData[] = [
  { month: 'Jan', users: 45, totalImages: 234, validatedImages: 156 },
  { month: 'Feb', users: 52, totalImages: 287, validatedImages: 201 },
  { month: 'Mar', users: 48, totalImages: 312, validatedImages: 223 },
  { month: 'Apr', users: 61, totalImages: 389, validatedImages: 267 },
  { month: 'May', users: 55, totalImages: 445, validatedImages: 312 },
  { month: 'Jun', users: 67, totalImages: 498, validatedImages: 356 },
  { month: 'Jul', users: 73, totalImages: 567, validatedImages: 398 },
  { month: 'Aug', users: 69, totalImages: 623, validatedImages: 445 },
  { month: 'Sep', users: 78, totalImages: 689, validatedImages: 487 },
  { month: 'Oct', users: 82, totalImages: 756, validatedImages: 534 },
  { month: 'Nov', users: 89, totalImages: 823, validatedImages: 589 },
  { month: 'Dec', users: 94, totalImages: 892, validatedImages: 634 },
];

// AI vs Human validation time metrics
export const aiHumanMetrics: AiHumanMetrics = {
  aiAvgSec: 2.3,
  humanAvgSec: 45.7,
  deltaAvgSec: 43.4, // humanAvgSec - aiAvgSec
};