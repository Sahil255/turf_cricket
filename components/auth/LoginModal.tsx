'use client'

import { useState } from 'react'
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { useToast } from '@/hooks/use-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const { toast } = useToast()

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
      })
    }
  }

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      setupRecaptcha()
      const appVerifier = window.recaptchaVerifier
      const fullPhoneNumber = `+91${phoneNumber}`
      
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier)
      setConfirmationResult(confirmationResult)
      setStep('otp')
      
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the verification code',
      })
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || !confirmationResult) return

    setLoading(true)
    try {
      const result = await confirmationResult.confirm(otp)
      const user = result.user
      
      // Check if user exists in our database
      const token = await user.getIdToken()
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 404) {
        // New user, show profile form
        setStep('profile')
      } else {
        // Existing user, close modal
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in',
        })
        onClose()
        resetForm()
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      toast({
        title: 'Invalid OTP',
        description: 'Please check your OTP and try again',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const user = auth.currentUser
      if (!user) throw new Error('No authenticated user')

      const token = await user.getIdToken()
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneNumber,
          email: email.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully',
      })
      onClose()
      resetForm()
    } catch (error: any) {
      console.error('Error creating profile:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('phone')
    setPhoneNumber('')
    setOtp('')
    setName('')
    setEmail('')
    setConfirmationResult(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <>
      <div id="recaptcha-container"></div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 'phone' && 'Login with Phone'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'profile' && 'Complete Your Profile'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {step === 'phone' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <PhoneInput
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <Button onClick={sendOTP} disabled={loading} className="w-full">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button onClick={verifyOTP} disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button variant="outline" onClick={() => setStep('phone')} className="w-full">
                  Change Phone Number
                </Button>
              </>
            )}

            {step === 'profile' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button onClick={createProfile} disabled={loading} className="w-full">
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}