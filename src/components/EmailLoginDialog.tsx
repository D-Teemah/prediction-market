'use client'

import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export default function EmailLoginDialog({ open, onOpenChange, onBack }: EmailLoginDialogProps) {
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  // Placeholder function for email login
  async function loginUserEmail(details: typeof credentials) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Logging in email user:', details)
    return { success: true, message: 'Login successful' }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all details')
      return
    }

    setLoading(true)
    // TODO: Connect to actual backend login endpoint
    const result = await loginUserEmail(credentials)
    setLoading(false)

    if (result.success) {
      toast.success('Logged in successfully!')
      onOpenChange(false)
      // Reset state
      setCredentials({ email: '', password: '' })
    }
    else {
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-1 -left-1 size-8"
            onClick={onBack}
            disabled={loading}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <DialogTitle className="text-center text-xl">
            Log In with Email
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground" type="button">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Log In
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
