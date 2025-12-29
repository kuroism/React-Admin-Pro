import { http, HttpResponse } from 'msw'
import type { Permission } from '@/api/permissions'

// Mock roles data store
interface Role {
  id: string
  name: string
  description: string
  permissionIds: string[]
  createdAt: string
  updatedAt: string
}

// eslint-disable-next-line prefer-const
let roles: Role[] = [
  {
    id: '1',
    name: 'user',
    description: 'Regular user with basic permissions',
    permissionIds: ['1'], // dashboard
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'admin',
    description: 'Administrator with full permissions',
    permissionIds: ['1', '2', '3', '4', '5'], // All permissions
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

export const rolesHandlers = [
  // Get all roles
  http.get('/api/roles', () => {
    return HttpResponse.json(roles)
  }),

  // Get role by ID
  http.get('/api/roles/:id', ({ params }) => {
    const { id } = params
    const role = roles.find(r => r.id === id)
    if (!role) {
      return HttpResponse.json({ error: 'Role not found' }, { status: 404 })
    }
    return HttpResponse.json(role)
  }),

  // Get role by name (for login flow)
  http.get('/api/roles/by-name/:name', ({ params }) => {
    const { name } = params
    const role = roles.find(r => r.name === name)
    if (!role) {
      return HttpResponse.json({ error: 'Role not found' }, { status: 404 })
    }
    return HttpResponse.json(role)
  }),

  // Create role
  http.post('/api/roles', async ({ request }) => {
    const body = (await request.json()) as Omit<Role, 'id' | 'createdAt' | 'updatedAt'>

    // Validate required fields
    if (!body.name) {
      return HttpResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if name already exists
    if (roles.some(r => r.name.toLowerCase() === body.name.toLowerCase())) {
      return HttpResponse.json({ error: 'Role name must be unique' }, { status: 400 })
    }

    const newRole: Role = {
      id: String(roles.length + 1),
      name: body.name,
      description: body.description || '',
      permissionIds: body.permissionIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    roles.push(newRole)
    return HttpResponse.json(newRole, { status: 201 })
  }),

  // Update role
  http.put('/api/roles/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>

    const index = roles.findIndex(r => r.id === id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    // Check if name is being updated and if it's unique
    if (body.name && body.name.toLowerCase() !== roles[index].name.toLowerCase()) {
      if (roles.some(r => r.name.toLowerCase() === body.name!.toLowerCase() && r.id !== id)) {
        return HttpResponse.json({ error: 'Role name must be unique' }, { status: 400 })
      }
    }

    const updatedRole: Role = {
      ...roles[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    roles[index] = updatedRole
    return HttpResponse.json(updatedRole)
  }),
]

// Export function to get role by name (for use in auth handler)
export function getRoleByName(name: string): Role | undefined {
  return roles.find(r => r.name.toLowerCase() === name.toLowerCase())
}

// Export function to get permissions for a role
export function getPermissionsForRole(roleName: string, allPermissions: Permission[]): string[] {
  const role = getRoleByName(roleName)
  if (!role) {
    return []
  }

  // Return permission identifiers instead of IDs
  return role.permissionIds
    .map(permissionId => {
      const permission = allPermissions.find(p => p.id === permissionId)
      return permission?.identifier
    })
    .filter((id): id is string => id !== undefined)
}
