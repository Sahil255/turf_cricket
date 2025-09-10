'use client'

import { useState, useEffect } from 'react'
import { X, Phone, MessageSquare, User } from 'lucide-react'
import { toast, useToast } from '@/hooks/use-toast'
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'

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
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const { toast } = useToast()

  // Detect keyboard open/close on mobile
  useEffect(() => {
    if (!isOpen) return

    const handleViewportChange = () => {
      // Check if visual viewport is available (modern browsers)
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height
        setIsKeyboardOpen(heightDiff > 150) // Threshold for keyboard detection
      }
    }

    const handleResize = () => {
      // Fallback for older browsers
      const heightDiff = window.screen.height - window.innerHeight
      setIsKeyboardOpen(heightDiff > 200)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
    } else {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
      } else {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isOpen])

  // Handle input focus with improved scrolling
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 300)
  }

  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '')
    
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly)
      setPhoneError(
        digitsOnly.length === 0 
          ? null 
          : digitsOnly.length === 10 
            ? null 
            : "Phone number must be 10 digits"
      )
    }
  }

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
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      setupRecaptcha()
      const appVerifier = window.recaptchaVerifier
      const fullPhoneNumber = `+91${phoneNumber}`
      console.log("SH phone number ",fullPhoneNumber);
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
    setPhoneError(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <>
    <div id="recaptcha-container"></div>
    <div className="fixed inset-0 z-50 flex  items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`
          relative w-full max-w-md mx-4 bg-gray-950  rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${isKeyboardOpen 
            ? 'max-h-[60vh] transform -translate-y-8' 
            : 'max-h-[85vh] transform translate-y-0'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center text-white justify-between p-6 border-b border-red-1000">
          <div className="flex items-center space-x-3">
            {step === 'phone' && <Phone className="w-6 h-6 text-white-600" />}
            {step === 'otp' && <MessageSquare className="w-6 h-6 text-white-600" />}
            {step === 'profile' && <User className="w-6 h-6 text-white-600" />}
            <h2 className="text-xl font-semibold text-white-900">
              {step === 'phone' && 'Login with Phone'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'profile' && 'Complete Profile'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onFocus={handleInputFocus}
                    className={`
                      w-full pl-20 pr-4 py-4 text-lg rounded-xl border-2 
                      transition-all duration-200 bg-gray-50
                      ${phoneError 
                        ? 'border-yellow-500 focus:amber-yellow-500' 
                        : 'border-gray-200 focus:red-blue-500 focus:bg-white'
                      }
                      focus:outline-none focus:shadow-lg
                    `}
                    maxLength={10}
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-yellow-600 mt-1">{phoneError}</p>
                )}
              </div>
              
              <button
                onClick={sendOTP}
                disabled={loading || phoneNumber.length !== 10}
                className={`
                  w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                  ${loading || phoneNumber.length !== 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700  text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-white">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-semibold text-white text-lg">+91 {phoneNumber}</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  OTP Code
                </label>
                <input
                  type="tel"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 6) setOtp(value)
                  }}
                  onFocus={handleInputFocus}
                  className="w-full px-4 py-4 text-xl text-center rounded-xl border-2 border-gray-200 
                           focus:border-red-500 focus:outline-none focus:bg-white focus:shadow-lg 
                           bg-gray-50 transition-all duration-200 tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={verifyOTP}
                  disabled={loading || otp.length !== 6}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                    ${loading || otp.length !== 6
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700  text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full py-3 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-100">Almost done! Complete your profile</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={handleInputFocus}
                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 
                             focus:border-red-500 focus:outline-none focus:bg-white focus:shadow-lg 
                             bg-gray-50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 
                             focus:border-red-500 focus:outline-none focus:bg-white focus:shadow-lg 
                             bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                onClick={createProfile}
                disabled={loading || !name.trim()}
                className={`
                  w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                  ${loading || !name.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700  text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

// Demo component to test the modal
export default function LoginDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Mobile-Friendly Login Modal
        </h1>
        <p className="text-gray-600 max-w-md">
          This modal automatically adjusts when the mobile keyboard opens, ensuring the input fields remain visible and accessible.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg 
                   hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Open Login Modal
        </button>
      </div>

      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}