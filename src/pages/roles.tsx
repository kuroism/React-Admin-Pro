import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PermissionsManagementDialog } from '@/features/permissions/components/management-dialog'

export default function RolesPage() {
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>
        <Button onClick={() => setIsPermissionsDialogOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Permissions Management
        </Button>
      </div>

      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Roles management coming soon...
      </div>

      <PermissionsManagementDialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
      />
    </div>
  )
}
