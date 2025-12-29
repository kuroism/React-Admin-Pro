import { authHandlers } from './handlers/auth'
import { permissionsHandlers } from './handlers/permissions'
import { rolesHandlers } from './handlers/roles'

// Combine all handlers
export const handlers = [...authHandlers, ...permissionsHandlers, ...rolesHandlers]
