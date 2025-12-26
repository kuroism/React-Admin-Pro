import { apiClient } from './client'

export type PermissionType = 'page' | 'action'

export interface Permission {
  id: string
  name: string
  identifier: string
  type: PermissionType
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreatePermissionRequest {
  name: string
  identifier: string
  type: PermissionType
  description: string
}

export interface UpdatePermissionRequest {
  name?: string
  identifier?: string
  type?: PermissionType
  description?: string
}

export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    const response = await apiClient.get<Permission[]>('/permissions')
    return response.data
  },

  getById: async (id: string): Promise<Permission> => {
    const response = await apiClient.get<Permission>(`/permissions/${id}`)
    return response.data
  },

  create: async (data: CreatePermissionRequest): Promise<Permission> => {
    const response = await apiClient.post<Permission>('/permissions', data)
    return response.data
  },

  update: async (id: string, data: UpdatePermissionRequest): Promise<Permission> => {
    const response = await apiClient.put<Permission>(`/permissions/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/permissions/${id}`)
  },
}
