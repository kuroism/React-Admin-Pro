import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authApi, type LoginRequest } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('admin')

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: data => {
      login(data.user, data.accessToken, data.refreshToken)
      navigate('/')
    },
    onError: error => {
      // Error is already handled by the error state in the mutation
      console.error('Login failed:', error)
    },
  })

  const getDefaultEmail = () => {
    return selectedRole === 'admin' ? 'admin@example.com' : 'user@example.com'
  }

  const getDefaultPassword = () => {
    return selectedRole === 'admin' ? 'admin123' : 'user123'
  }

  const handleSubmit = (data: { email: string; password: string }) => {
    loginMutation.mutate({ ...data, role: selectedRole })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Select your role and enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selector */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedRole === 'admin' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedRole('admin')}
              disabled={loginMutation.isPending}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
            <Button
              type="button"
              variant={selectedRole === 'user' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setSelectedRole('user')}
              disabled={loginMutation.isPending}
            >
              <User className="mr-2 h-4 w-4" />
              User
            </Button>
          </div>

          {/* Error Message */}
          {loginMutation.error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {loginMutation.error instanceof AxiosError
                ? loginMutation.error.response?.data?.error ||
                  loginMutation.error.message ||
                  'Login failed. Please try again.'
                : loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'Login failed. Please try again.'}
            </div>
          )}

          {/* Login Form */}
          <LoginForm
            selectedRole={selectedRole}
            defaultEmail={getDefaultEmail()}
            defaultPassword={getDefaultPassword()}
            onSubmit={handleSubmit}
            isLoading={loginMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface LoginFormProps {
  selectedRole: 'admin' | 'user'
  defaultEmail: string
  defaultPassword: string
  onSubmit: (data: { email: string; password: string }) => void
  isLoading: boolean
}

function LoginForm({
  selectedRole,
  defaultEmail,
  defaultPassword,
  onSubmit,
  isLoading,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
      role: selectedRole,
    },
  })

  // Reset form when role changes
  useEffect(() => {
    reset({
      email: defaultEmail,
      password: defaultPassword,
      role: selectedRole,
    })
  }, [selectedRole, defaultEmail, defaultPassword, reset])

  return (
    <form onSubmit={handleSubmit(data => onSubmit({ email: data.email, password: data.password }))}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
      </div>
      <CardFooter className="px-0 pt-6">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </CardFooter>
    </form>
  )
}
