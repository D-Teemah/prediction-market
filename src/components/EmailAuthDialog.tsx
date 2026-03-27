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

interface EmailAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export default function EmailAuthDialog({ open, onOpenChange, onBack }: EmailAuthDialogProps) {
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Placeholder function for email registration
  async function registerUserEmail(details: typeof userDetails) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Registering email user:', details)
    return { success: true, message: 'Registration successful' }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userDetails.name || !userDetails.email || !userDetails.password) {
      toast.error('Please fill in all details')
      return
    }

    setLoading(true)
    // TODO: Connect to actual backend registration endpoint
    const result = await registerUserEmail(userDetails)
    setLoading(false)

    if (result.success) {
      toast.success('Account created successfully!')
      onOpenChange(false)
      // Reset state
      setUserDetails({ name: '', email: '', password: '' })
    }
    else {
      toast.error(result.message || 'Registration failed')
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
            Sign Up with Email
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={userDetails.name}
                onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={userDetails.email}
                onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={userDetails.password}
                onChange={e => setUserDetails({ ...userDetails, password: e.target.value })}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
