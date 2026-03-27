export interface TermiiResponse {
  message_id?: string
  message?: string
  balance?: number
  user?: string
  status?: string
  pinId?: string
  to?: string
  smsStatus?: string
  verified?: boolean
  error?: string
}

const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com'
const TERMII_API_KEY = process.env.TERMII_API_KEY
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'GPay'

export async function sendTermiiOTP(phone: string): Promise<{ success: boolean, pinId?: string, message?: string }> {
  if (!TERMII_API_KEY) {
    console.error('TERMII_API_KEY is not configured')
    // For development without key, simulate success
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Mock sending OTP to ${phone}`)
      return { success: true, pinId: `mock-pin-id-${Date.now()}`, message: 'OTP sent (mock)' }
    }
    return { success: false, message: 'SMS service not configured' }
  }

  // Ensure phone number format is correct (Termii often expects format without + for some routes or specific international format)
  // But generally, international format like 234... is good.
  // Let's strip the '+' if present just in case, as some SMS gateways prefer raw digits.
  const formattedPhone = phone.replace('+', '')

  try {
    const payload = {
      api_key: TERMII_API_KEY,
      to: formattedPhone,
      from: TERMII_SENDER_ID,
      sms: 'Your Baba Markets verification code is < 1234 >',
      type: 'plain',
      channel: 'dnd', // or 'generic'
    }

    console.log('Sending Termii Request:', { ...payload, api_key: '***' })

    const response = await fetch(`${TERMII_BASE_URL}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json() as TermiiResponse
    console.log('Termii Response:', data)

    if (response.ok && data.pinId) {
      return { success: true, pinId: data.pinId, message: 'OTP sent successfully' }
    }
    else {
      console.error('Termii Error:', data)
      // "No message available" often comes from balance issues or invalid route/sender ID
      return { success: false, message: data.message || data.error || 'Failed to send OTP' }
    }
  }
  catch (error) {
    console.error('Termii Exception:', error)
    return { success: false, message: 'Failed to connect to SMS service' }
  }
}

export async function verifyTermiiOTP(pinId: string, pin: string): Promise<{ success: boolean, message?: string }> {
  if (!TERMII_API_KEY) {
    if (process.env.NODE_ENV === 'development' && pinId.startsWith('mock-pin-id-')) {
      console.log(`[DEV] Mock verifying OTP ${pin} for ${pinId}`)
      return { success: true, message: 'OTP verified (mock)' }
    }
    return { success: false, message: 'SMS service not configured' }
  }

  try {
    const payload = {
      api_key: TERMII_API_KEY,
      pin_id: pinId,
      pin,
    }

    const response = await fetch(`${TERMII_BASE_URL}/sms/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json() as TermiiResponse

    if (response.ok && data.verified === true) { // Termii can return verified: "true" string sometimes, better check
      // Termii docs say: "verified": true/false or "true"/"false" depending on endpoint version
      // Strict check if typed correctly, or loose check
      return { success: true, message: 'OTP verified successfully' }
    }
    else if (data.verified) {
      // Handle string "true" if API behaves that way
      return { success: true, message: 'OTP verified successfully' }
    }
    else {
      return { success: false, message: data.message || 'Invalid OTP' }
    }
  }
  catch (error) {
    console.error('Termii Verify Exception:', error)
    return { success: false, message: 'Failed to verify OTP' }
  }
}
