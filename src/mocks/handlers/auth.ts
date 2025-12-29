import { http, HttpResponse } from 'msw'
import { getRoleByName, getPermissionsForRole } from './roles'
import { permissions } from './permissions'

interface LoginRequest {
  email: string
  password: string
  role: string
}

export const authHandlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest

    // Validate credentials
    if (!body.email || !body.password || !body.role) {
      return HttpResponse.json({ error: 'Email, password, and role are required' }, { status: 400 })
    }

    // Get role and calculate permissions
    const role = getRoleByName(body.role)
    if (!role) {
      return HttpResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const userPermissions = getPermissionsForRole(body.role, permissions)

    // Mock authentication logic - check credentials
    const isValidCredentials =
      (body.role === 'admin' &&
        body.email === 'admin@example.com' &&
        body.password === 'admin123') ||
      (body.role === 'user' && body.email === 'user@example.com' && body.password === 'user123')

    if (!isValidCredentials) {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Return user with permissions calculated from role
    const user = {
      id: body.role === 'admin' ? '1' : '2',
      email: body.email,
      name: body.role === 'admin' ? 'Admin User' : 'Regular User',
      role: body.role,
      permissions: userPermissions,
    }

    return HttpResponse.json({
      user,
      accessToken: `mock-${body.role}-access-token`,
      refreshToken: `mock-${body.role}-refresh-token`,
    })
  }),
]
