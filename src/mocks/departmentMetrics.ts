// Department-wise validation metrics mock data

export interface DepartmentMonthlyData {
  month: string;
  safety: number;
  operations: number;
  maintenance: number;
  security: number;
}

// Last 12 months of department-wise validation data
export const departmentValidationMetrics: DepartmentMonthlyData[] = [
  { month: 'Jan', safety: 45, operations: 32, maintenance: 28, security: 15 },
  { month: 'Feb', safety: 52, operations: 38, maintenance: 31, security: 18 },
  { month: 'Mar', safety: 48, operations: 41, maintenance: 35, security: 22 },
  { month: 'Apr', safety: 61, operations: 45, maintenance: 38, security: 25 },
  { month: 'May', safety: 55, operations: 48, maintenance: 42, security: 28 },
  { month: 'Jun', safety: 67, operations: 52, maintenance: 45, security: 31 },
  { month: 'Jul', safety: 73, operations: 58, maintenance: 48, security: 35 },
  { month: 'Aug', safety: 69, operations: 61, maintenance: 52, security: 38 },
  { month: 'Sep', safety: 78, operations: 65, maintenance: 55, security: 42 },
  { month: 'Oct', safety: 82, operations: 68, maintenance: 58, security: 45 },
  { month: 'Nov', safety: 89, operations: 72, maintenance: 62, security: 48 },
  { month: 'Dec', safety: 94, operations: 76, maintenance: 65, security: 52 },
];