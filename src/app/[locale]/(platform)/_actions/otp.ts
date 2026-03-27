'use server'

import { sendTermiiOTP, verifyTermiiOTP } from '@/lib/termii'

export async function sendOtpAction(phone: string) {
  try {
    // Basic phone validation (can be enhanced)
    if (!phone || phone.length < 10) {
      return { success: false, message: 'Invalid phone number' }
    }

    const result = await sendTermiiOTP(phone)
    return result
  }
  catch (error) {
    console.error('Error in sendOtpAction:', error)
    return { success: false, message: 'Internal server error' }
  }
}

export async function verifyOtpAction(pinId: string, pin: string) {
  try {
    if (!pinId || !pin) {
      return { success: false, message: 'Missing verification details' }
    }

    const result = await verifyTermiiOTP(pinId, pin)
    return result
  }
  catch (error) {
    console.error('Error in verifyOtpAction:', error)
    return { success: false, message: 'Internal server error' }
  }
}

export async function registerUserAction(userDetails: { name: string, email: string, password?: string, phone: string }) {
  // This function would interact with your database/auth system (e.g. Supabase, BetterAuth)
  // For now, we'll mock the registration

  console.log('Registering user:', { ...userDetails, password: '***' })

  // Simulate DB delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // TODO: Implement actual user creation logic here
  // e.g. supabase.auth.signUp() or insert into users table

  return { success: true, message: 'User registered successfully' }
}
