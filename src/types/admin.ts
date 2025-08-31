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
  name: string;
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
  // NEW: default from imagesSlice when uploading
  aivalidated?: boolean; // default false on upload
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

// New for annotation
export interface IBoundingBox {
  id: string;
  x: number;  // normalized [0..1]
  y: number;
  width: number;
  height: number;
  createdAt: string;
  createdBy: string; // empid or user id
}

export interface IAnnotatedViolation extends IViolation {
  bbox: IBoundingBox;        // the drawn box for this violation
  notes?: string;            // optional analyst note
  isNew?: boolean;           // true if user created a brand-new violation label
}

export interface IAnnotatedImage extends IImage {
  annotatedAt: string;
  annotatedBy: string;       // empid or user id
  validated: boolean;        // true when all violations for this image are assigned
  // Replace raw violations with annotated ones specifically for this record:
  annotatedViolations: IAnnotatedViolation[];
  imageWidth?: number;       // Canvas width for backend bounding box processing
  imageHeight?: number;      // Canvas height for backend bounding box processing
}

export interface AnnotatedImagesState {
  items: IAnnotatedImage[];
  page: number;
  pageSize: number;
  total: number;
  status: AsyncStatus;
  error?: string;
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