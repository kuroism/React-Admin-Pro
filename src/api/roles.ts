import { apiClient } from './client'

export interface Role {
  id: string
  name: string
  description: string
  permissionIds: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissionIds: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissionIds?: string[]
}

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles')
    return response.data
  },

  getById: async (id: string): Promise<Role> => {
    const response = await apiClient.get<Role>(`/roles/${id}`)
    return response.data
  },

  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', data)
    return response.data
  },

  update: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, data)
    return response.data
  },
}
