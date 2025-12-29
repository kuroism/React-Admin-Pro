import { useState } from 'react'
import { Settings, Plus, Pencil, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PermissionsManagementDialog } from '@/features/permissions/components/management-dialog'
import { RoleFormDialog } from '@/features/roles/components/role-form-dialog'
import { RoleDetailDialog } from '@/features/roles/components/role-detail-dialog'
import { rolesApi, type Role } from '@/api/roles'

export default function RolesPage() {
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false)
  const [isRoleDetailOpen, setIsRoleDetailOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [viewingRole, setViewingRole] = useState<Role | null>(null)

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getAll(),
  })

  const handleCreate = () => {
    setEditingRole(null)
    setIsRoleFormOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsRoleFormOpen(true)
  }

  const handleView = (role: Role) => {
    setViewingRole(role)
    setIsRoleDetailOpen(true)
  }

  const handleFormSuccess = () => {
    setEditingRole(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
          <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Permissions Management
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading roles...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No roles found. Create your first role.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map(role => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {role.description || '-'}
                    </TableCell>
                    <TableCell>{role.permissionIds.length} permissions</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(role)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(role)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <PermissionsManagementDialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
      />

      <RoleFormDialog
        open={isRoleFormOpen}
        onOpenChange={setIsRoleFormOpen}
        editingRole={editingRole}
        onSuccess={handleFormSuccess}
      />

      <RoleDetailDialog
        open={isRoleDetailOpen}
        onOpenChange={setIsRoleDetailOpen}
        role={viewingRole}
      />
    </div>
  )
}
