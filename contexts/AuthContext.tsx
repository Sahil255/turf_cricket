'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser)
    }
  }

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}