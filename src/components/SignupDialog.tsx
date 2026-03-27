'use client'

import { MailIcon, PhoneIcon } from 'lucide-react'
import { useState } from 'react'
import EmailAuthDialog from '@/components/EmailAuthDialog'
import PhoneAuthDialog from '@/components/PhoneAuthDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAppKit } from '@/hooks/useAppKit'

interface SignupDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function SignupDialog({ trigger, open: controlledOpen, onOpenChange }: SignupDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [phoneAuthOpen, setPhoneAuthOpen] = useState(false)
  const [emailAuthOpen, setEmailAuthOpen] = useState(false)
  const { open: openAppKit } = useAppKit()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  async function handleReownSignup() {
    // Reown AppKit handles social and email logins if configured
    if (setOpen) {
      setOpen(false)
    }
    await openAppKit()
  }

  function handlePhoneSignup() {
    if (setOpen) {
      setOpen(false)
    }
    setPhoneAuthOpen(true)
  }

  function handleEmailSignup() {
    if (setOpen) {
      setOpen(false)
    }
    setEmailAuthOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Sign Up</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 px-4" onClick={handleEmailSignup}>
              <MailIcon className="size-5" />
              <span>Signup with email</span>
            </Button>

            <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 px-4" onClick={handlePhoneSignup}>
              <PhoneIcon className="size-5" />
              <span>Signup with phone</span>
            </Button>

            <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 px-4" onClick={handleReownSignup}>
              {/* Google Icon */}
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Signup with Google</span>
            </Button>

            <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 px-4" onClick={handleReownSignup}>
              {/* Facebook Icon */}
              <svg className="size-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Signup with Facebook</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PhoneAuthDialog
        open={phoneAuthOpen}
        onOpenChange={setPhoneAuthOpen}
        onBack={() => {
          setPhoneAuthOpen(false)
          if (setOpen) {
            setOpen(true)
          }
        }}
      />

      <EmailAuthDialog
        open={emailAuthOpen}
        onOpenChange={setEmailAuthOpen}
        onBack={() => {
          setEmailAuthOpen(false)
          if (setOpen) {
            setOpen(true)
          }
        }}
      />
    </>
  )
}
