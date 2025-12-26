import { http, HttpResponse } from 'msw'

// Mock permissions data store
interface Permission {
  id: string
  name: string
  identifier: string
  type: 'page' | 'action'
  description: string
  createdAt: string
  updatedAt: string
}

// eslint-disable-next-line prefer-const
let permissions: Permission[] = [
  {
    id: '1',
    name: 'Dashboard Access',
    identifier: 'dashboard:read',
    type: 'page',
    description: 'Access to view the dashboard page',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'User Management',
    identifier: 'users:read',
    type: 'page',
    description: 'Access to view users page',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Create User',
    identifier: 'users:create',
    type: 'action',
    description: 'Permission to create new users',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Edit User',
    identifier: 'users:update',
    type: 'action',
    description: 'Permission to edit existing users',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Delete User',
    identifier: 'users:delete',
    type: 'action',
    description: 'Permission to delete users',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

export const permissionsHandlers = [
  // Permissions endpoints
  http.get('/api/permissions', () => {
    return HttpResponse.json(permissions)
  }),

  http.get('/api/permissions/:id', ({ params }) => {
    const { id } = params
    const permission = permissions.find(p => p.id === id)
    if (!permission) {
      return HttpResponse.json({ error: 'Permission not found' }, { status: 404 })
    }
    return HttpResponse.json(permission)
  }),

  http.post('/api/permissions', async ({ request }) => {
    const body = (await request.json()) as Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>

    // Validate required fields
    if (!body.name || !body.identifier || !body.type) {
      return HttpResponse.json(
        { error: 'Name, identifier, and type are required' },
        { status: 400 }
      )
    }

    // Check if identifier already exists
    if (permissions.some(p => p.identifier === body.identifier)) {
      return HttpResponse.json({ error: 'Identifier must be unique' }, { status: 400 })
    }

    const newPermission: Permission = {
      id: String(permissions.length + 1),
      name: body.name,
      identifier: body.identifier,
      type: body.type,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    permissions.push(newPermission)
    return HttpResponse.json(newPermission, { status: 201 })
  }),

  http.put('/api/permissions/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<
      Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>
    >

    const index = permissions.findIndex(p => p.id === id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Permission not found' }, { status: 404 })
    }

    // Check if identifier is being updated and if it's unique
    if (body.identifier && body.identifier !== permissions[index].identifier) {
      if (permissions.some(p => p.identifier === body.identifier && p.id !== id)) {
        return HttpResponse.json({ error: 'Identifier must be unique' }, { status: 400 })
      }
    }

    const updatedPermission: Permission = {
      ...permissions[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    permissions[index] = updatedPermission
    return HttpResponse.json(updatedPermission)
  }),

  http.delete('/api/permissions/:id', ({ params }) => {
    const { id } = params
    const index = permissions.findIndex(p => p.id === id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Permission not found' }, { status: 404 })
    }

    permissions.splice(index, 1)
    return HttpResponse.json({ message: 'Permission deleted successfully' })
  }),
]
