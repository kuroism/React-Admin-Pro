import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
    permissions: string[]
  }
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}
