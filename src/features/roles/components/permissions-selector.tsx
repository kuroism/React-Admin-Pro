import { useQuery } from '@tanstack/react-query'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { permissionsApi } from '@/api/permissions'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface PermissionsSelectorProps {
  selectedPermissionIds: string[]
  onSelectionChange: (permissionIds: string[]) => void
  disabled?: boolean
}

export function PermissionsSelector({
  selectedPermissionIds,
  onSelectionChange,
  disabled = false,
}: PermissionsSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<'page' | 'action'>>(
    new Set(['page', 'action'])
  )

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsApi.getAll(),
  })

  const pagePermissions = permissions.filter(p => p.type === 'page')
  const actionPermissions = permissions.filter(p => p.type === 'action')

  const toggleGroup = (type: 'page' | 'action') => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedGroups(newExpanded)
  }

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPermissionIds, permissionId])
    } else {
      onSelectionChange(selectedPermissionIds.filter(id => id !== permissionId))
    }
  }

  const handleGroupToggle = (type: 'page' | 'action', checked: boolean) => {
    const groupPermissions = type === 'page' ? pagePermissions : actionPermissions
    const groupPermissionIds = groupPermissions.map(p => p.id)

    if (checked) {
      // Add all group permissions
      const newIds = [...new Set([...selectedPermissionIds, ...groupPermissionIds])]
      onSelectionChange(newIds)
    } else {
      // Remove all group permissions
      onSelectionChange(selectedPermissionIds.filter(id => !groupPermissionIds.includes(id)))
    }
  }

  const isGroupAllSelected = (type: 'page' | 'action') => {
    const groupPermissions = type === 'page' ? pagePermissions : actionPermissions
    if (groupPermissions.length === 0) return false
    return groupPermissions.every(p => selectedPermissionIds.includes(p.id))
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading permissions...</div>
  }

  return (
    <div className="space-y-4">
      {/* Page Permissions Group */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => toggleGroup('page')}
            className="flex items-center space-x-1 text-sm font-medium hover:text-foreground"
            disabled={disabled}
          >
            {expandedGroups.has('page') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Page Permissions</span>
          </button>
          <Checkbox
            checked={isGroupAllSelected('page')}
            onCheckedChange={checked => handleGroupToggle('page', checked === true)}
            disabled={disabled || pagePermissions.length === 0}
            className="ml-2"
          />
          <Label className="text-xs text-muted-foreground">
            ({pagePermissions.filter(p => selectedPermissionIds.includes(p.id)).length}/
            {pagePermissions.length} selected)
          </Label>
        </div>

        {expandedGroups.has('page') && (
          <div className="ml-6 space-y-2">
            {pagePermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No page permissions available</p>
            ) : (
              pagePermissions.map(permission => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissionIds.includes(permission.id)}
                    onCheckedChange={checked =>
                      handlePermissionToggle(permission.id, checked === true)
                    }
                    disabled={disabled}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    {permission.description && (
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    )}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {permission.identifier}
                    </code>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Action Permissions Group */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => toggleGroup('action')}
            className="flex items-center space-x-1 text-sm font-medium hover:text-foreground"
            disabled={disabled}
          >
            {expandedGroups.has('action') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>Action Permissions</span>
          </button>
          <Checkbox
            checked={isGroupAllSelected('action')}
            onCheckedChange={checked => handleGroupToggle('action', checked === true)}
            disabled={disabled || actionPermissions.length === 0}
            className="ml-2"
          />
          <Label className="text-xs text-muted-foreground">
            ({actionPermissions.filter(p => selectedPermissionIds.includes(p.id)).length}/
            {actionPermissions.length} selected)
          </Label>
        </div>

        {expandedGroups.has('action') && (
          <div className="ml-6 space-y-2">
            {actionPermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No action permissions available</p>
            ) : (
              actionPermissions.map(permission => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissionIds.includes(permission.id)}
                    onCheckedChange={checked =>
                      handlePermissionToggle(permission.id, checked === true)
                    }
                    disabled={disabled}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    {permission.description && (
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    )}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {permission.identifier}
                    </code>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {permissions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No permissions available. Please create permissions first.
        </p>
      )}
    </div>
  )
}
