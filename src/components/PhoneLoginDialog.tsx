'use client'

import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { sendOtpAction, verifyOtpAction } from '@/app/[locale]/(platform)/_actions/otp'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Step = 'PHONE_ENTRY' | 'OTP_VERIFICATION'

interface PhoneLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export default function PhoneLoginDialog({ open, onOpenChange, onBack }: PhoneLoginDialogProps) {
  const [step, setStep] = useState<Step>('PHONE_ENTRY')
  const [loading, setLoading] = useState(false)
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pinId, setPinId] = useState('')
  const [otp, setOtp] = useState('')

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setLoading(true)
    const fullPhoneNumber = `${countryCode}${phoneNumber}`
    // Using same OTP action for now. In real app, might want a specific login OTP action
    // that checks if user exists first.
    const result = await sendOtpAction(fullPhoneNumber)
    setLoading(false)

    if (result.success && result.pinId) {
      setPinId(result.pinId)
      toast.success(result.message || 'OTP sent successfully')
      setStep('OTP_VERIFICATION')
    }
    else {
      toast.error(result.message || 'Failed to send OTP')
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    const result = await verifyOtpAction(pinId, otp)

    // Simulate login session creation
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setLoading(false)

    if (result.success) {
      toast.success('Logged in successfully!')
      onOpenChange(false)
      // Reset state
      setStep('PHONE_ENTRY')
      setPhoneNumber('')
      setOtp('')
      setPinId('')
    }
    else {
      toast.error(result.message || 'Invalid OTP')
    }
  }

  function handleBack() {
    if (step === 'PHONE_ENTRY') {
      onBack()
    }
    else if (step === 'OTP_VERIFICATION') {
      setStep('PHONE_ENTRY')
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
            onClick={handleBack}
            disabled={loading}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <DialogTitle className="text-center text-xl">
            {step === 'PHONE_ENTRY' && 'Log In with Phone'}
            {step === 'OTP_VERIFICATION' && 'Verify OTP'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 'PHONE_ENTRY' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode} disabled={loading}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+234">🇳🇬 +234</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+233">🇬🇭 +233</SelectItem>
                      <SelectItem value="+254">🇰🇪 +254</SelectItem>
                      <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="login-phone"
                    type="tel"
                    placeholder="801 234 5678"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setPhoneNumber(val)
                    }}
                    disabled={loading}
                    autoFocus
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a 6-digit code to verify your number.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                Send Code
              </Button>
            </form>
          )}

          {step === 'OTP_VERIFICATION' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label>Enter 6-digit Code</Label>
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={value => setOtp(value)}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Sent to
                  {' '}
                  {countryCode}
                  {' '}
                  {phoneNumber}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                Verify & Log In
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
