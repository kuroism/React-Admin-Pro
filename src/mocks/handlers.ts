import { authHandlers } from './handlers/auth'
import { permissionsHandlers } from './handlers/permissions'

// Combine all handlers
export const handlers = [...authHandlers, ...permissionsHandlers]
