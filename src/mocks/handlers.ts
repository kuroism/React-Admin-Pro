import { http, HttpResponse } from 'msw'

interface LoginRequest {
  email: string
  password: string
  role: 'admin' | 'user'
}

const adminUser = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  permissions: ['read', 'write', 'delete', 'admin'],
}

const regularUser = {
  id: '2',
  email: 'user@example.com',
  name: 'Regular User',
  role: 'user',
  permissions: ['read'],
}

export const handlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest

    // Validate credentials
    if (!body.email || !body.password || !body.role) {
      return HttpResponse.json({ error: 'Email, password, and role are required' }, { status: 400 })
    }

    // Mock authentication logic
    if (body.role === 'admin') {
      if (body.email === 'admin@example.com' && body.password === 'admin123') {
        return HttpResponse.json({
          user: adminUser,
          accessToken: 'mock-admin-access-token',
          refreshToken: 'mock-admin-refresh-token',
        })
      }
    } else if (body.role === 'user') {
      if (body.email === 'user@example.com' && body.password === 'user123') {
        return HttpResponse.json({
          user: regularUser,
          accessToken: 'mock-user-access-token',
          refreshToken: 'mock-user-refresh-token',
        })
      }
    }

    // Invalid credentials
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }),

  // Logout endpoint
  http.post('/api/auth/logout', async () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),
]
