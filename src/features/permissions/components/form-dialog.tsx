import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
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
import { permissionsApi, type Permission } from '@/api/permissions'

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  identifier: z.string().min(1, 'Identifier is required'),
  type: z.enum(['page', 'action']),
  description: z.string().optional(),
})

type PermissionFormValues = z.infer<typeof permissionSchema>

interface PermissionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPermission?: Permission | null
  onSuccess?: () => void
}

export function PermissionFormDialog({
  open,
  onOpenChange,
  editingPermission,
  onSuccess,
}: PermissionFormDialogProps) {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: PermissionFormValues) => permissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      onSuccess?.()
      handleClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PermissionFormValues }) =>
      permissionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
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
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      identifier: '',
      type: 'page',
      description: '',
    },
  })

  // Reset form when dialog opens/closes or editingPermission changes
  useEffect(() => {
    if (open) {
      if (editingPermission) {
        setValue('name', editingPermission.name)
        setValue('identifier', editingPermission.identifier)
        setValue('type', editingPermission.type)
        setValue('description', editingPermission.description)
      } else {
        reset({
          name: '',
          identifier: '',
          type: 'page',
          description: '',
        })
      }
    } else {
      reset()
    }
  }, [open, editingPermission, setValue, reset])

  const handleClose = () => {
    onOpenChange(false)
    reset()
  }

  const onSubmit = (data: PermissionFormValues) => {
    if (editingPermission) {
      updateMutation.mutate({ id: editingPermission.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingPermission ? 'Edit Permission' : 'Create Permission'}</DialogTitle>
          <DialogDescription>
            {editingPermission
              ? 'Update the permission details below.'
              : 'Fill in the details to create a new permission.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} disabled={isLoading} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">Identifier (Key)</Label>
              <Input
                id="identifier"
                {...register('identifier')}
                disabled={isLoading || !!editingPermission}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              {...register('type')}
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="page">Page</option>
              <option value="action">Action</option>
            </select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} disabled={isLoading} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {editingPermission ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
