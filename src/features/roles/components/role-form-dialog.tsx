import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { rolesApi, type Role } from '@/api/roles'
import { PermissionsSelector } from './permissions-selector'

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingRole?: Role | null
  onSuccess?: () => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  editingRole,
  onSuccess,
}: RoleFormDialogProps) {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: RoleFormValues) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      onSuccess?.()
      handleClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleFormValues }) => rolesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      onSuccess?.()
      handleClose()
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
  })

  const selectedPermissionIds = useWatch({ control, name: 'permissionIds' })

  // Reset form when dialog opens/closes or editingRole changes
  useEffect(() => {
    if (open) {
      if (editingRole) {
        setValue('name', editingRole.name)
        setValue('description', editingRole.description)
        setValue('permissionIds', editingRole.permissionIds)
      } else {
        reset({
          name: '',
          description: '',
          permissionIds: [],
        })
      }
    } else {
      reset()
    }
  }, [open, editingRole, setValue, reset])

  const handleClose = () => {
    onOpenChange(false)
    reset()
  }

  const onSubmit = (data: RoleFormValues) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
          <DialogDescription>
            {editingRole
              ? 'Update the role details and permissions below.'
              : 'Fill in the details to create a new role.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} disabled={isLoading} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="border rounded-lg p-4">
              <PermissionsSelector
                selectedPermissionIds={selectedPermissionIds}
                onSelectionChange={permissionIds => setValue('permissionIds', permissionIds)}
                disabled={isLoading}
              />
            </div>
            {errors.permissionIds && (
              <p className="text-sm text-destructive">{errors.permissionIds.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
