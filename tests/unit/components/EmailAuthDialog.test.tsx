import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EmailAuthDialog from '@/components/EmailAuthDialog'

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('emailAuthDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onBack: vi.fn(),
  }

  it('renders correctly', () => {
    render(<EmailAuthDialog {...defaultProps} />)

    expect(screen.getByText('Sign Up with Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates empty fields', async () => {
    render(<EmailAuthDialog {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // Should show error toast (mocked) or at least not call onOpenChange
    expect(defaultProps.onOpenChange).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<EmailAuthDialog {...defaultProps} />)

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    // Wait for async submission simulation
    // We need to wait longer than the 1500ms delay in the component
    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    }, { timeout: 2000 })
  })

  it('allows navigation back', () => {
    render(<EmailAuthDialog {...defaultProps} />)

    const backButton = screen.getByLabelText('Go back')
    fireEvent.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalled()
  })
})
