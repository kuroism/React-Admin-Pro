// Shared TypeScript interfaces and types

export interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}
