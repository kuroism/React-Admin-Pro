import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { permissionsApi } from '@/api/permissions'
import { type Role } from '@/api/roles'
import { Badge } from '@/components/ui/badge'

interface RoleDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export function RoleDetailDialog({ open, onOpenChange, role }: RoleDetailDialogProps) {
  const { data: allPermissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsApi.getAll(),
  })

  if (!role) return null

  const rolePermissions = allPermissions.filter(p => role.permissionIds.includes(p.id))
  const pagePermissions = rolePermissions.filter(p => p.type === 'page')
  const actionPermissions = rolePermissions.filter(p => p.type === 'action')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Details: {role.name}</DialogTitle>
          <DialogDescription>{role.description || 'No description provided.'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{role.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium">{role.description || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Permissions:</span>
                <span className="font-medium">{rolePermissions.length}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Permissions ({rolePermissions.length})</h3>

            {rolePermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No permissions assigned to this role.</p>
            ) : (
              <div className="space-y-4">
                {pagePermissions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Page Permissions ({pagePermissions.length})
                    </h4>
                    <div className="space-y-2">
                      {pagePermissions.map(permission => (
                        <div
                          key={permission.id}
                          className="border rounded-lg p-3 space-y-1 bg-card"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{permission.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              Page
                            </Badge>
                          </div>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                          <code className="text-xs bg-muted px-2 py-1 rounded block w-fit">
                            {permission.identifier}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {actionPermissions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Action Permissions ({actionPermissions.length})
                    </h4>
                    <div className="space-y-2">
                      {actionPermissions.map(permission => (
                        <div
                          key={permission.id}
                          className="border rounded-lg p-3 space-y-1 bg-card"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{permission.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              Action
                            </Badge>
                          </div>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                          <code className="text-xs bg-muted px-2 py-1 rounded block w-fit">
                            {permission.identifier}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
