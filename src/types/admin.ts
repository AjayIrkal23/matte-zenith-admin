// Adani Admin Dashboard - Type Definitions

export interface IUser {
  id: string;
  name: string;
  email: string;
  empid: string;
  department: string;
  validatedImages: number;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IViolation {
  name: "Helmet Missing" | "Fire Hazard" | "Dust" | "Parking";
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

export interface IImage {
  id: string;
  name: string;
  imageURL: string;
  imagePath: string;
  violations: IViolation[];
  uploadedAt?: string;
  fileSize?: number;
}

// Redux state types
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface UsersState {
  items: IUser[];
  status: AsyncStatus;
  error?: string;
}

export interface ImagesState {
  items: IImage[];
  page: number;
  pageSize: number;
  total: number;
  status: AsyncStatus;
  error?: string;
  uploadProgress?: number;
}

export interface LeaderboardState {
  top: IUser[];
  all: IUser[];
  status: AsyncStatus;
  error?: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Form types
export interface UserFormData {
  name: string;
  email: string;
  empid: string;
  department: string;
  validatedImages: number;
}

// Component prop types
export interface PageProps {
  className?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
}