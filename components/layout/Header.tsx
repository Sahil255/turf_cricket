'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LoginModal } from '@/components/auth/LoginModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, LogOut, Calendar, Settings, Menu, X } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true);
    await signOut()
    setIsMobileMenuOpen(false)
    setLoading(false);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="border-b bg-white dark:bg-secondary-900 sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-display text-primary-600 hover:text-primary-700 transition-colors duration-300"
            aria-label="RCB CricketTurf Home"
          >
            RCB CricketTurf
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-secondary-600 hover:text-primary-600 font-sans text-base transition-colors duration-300 animate-slide-in"
            >
              Home
            </Link>
            <Link
              href="/turfs"
              className="text-secondary-600 hover:text-primary-600 font-sans text-base transition-colors duration-300 animate-slide-in"
            >
              Book Turf
            </Link>
            {user && (
              <Link
                href="/bookings"
                className="text-secondary-600 hover:text-primary-600 font-sans text-base transition-colors duration-300 animate-slide-in"
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary-600 hover:text-primary-600 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-primary-50 transition-colors duration-300"
                    aria-label="User menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-white dark:bg-secondary-800 shadow-medium animate-fade-in"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">
                        {user.name}
                      </p>
                      <p className="w-[180px] truncate text-sm text-secondary-600 dark:text-secondary-400">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-secondary-200 dark:bg-secondary-700" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer text-secondary-600 dark:text-secondary-100 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/bookings"
                      className="flex items-center cursor-pointer text-secondary-600 dark:text-secondary-100 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/turfs"
                        className="flex items-center cursor-pointer text-secondary-600 dark:text-secondary-100 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-secondary-200 dark:bg-secondary-700" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center cursor-pointer text-secondary-600 dark:text-secondary-100 hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary-500 text-white hover:bg-primary-600 font-sans transition-colors duration-300 animate-bounce-in"
              >
                Login
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-secondary-900 border-b shadow-soft animate-slide-in">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-secondary-600 hover:text-primary-600 font-sans text-lg transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {/* <Link
                href="/turfs"
                className="text-secondary-600 hover:text-primary-600 font-sans text-lg transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Turf
              </Link> */}
              {user && (
                <>
                  <Link
                    href="/bookings"
                    className="text-secondary-600 hover:text-primary-600 font-sans text-lg transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/profile"
                    className="text-secondary-600 hover:text-primary-600 font-sans text-lg transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/turfs"
                      className="text-secondary-600 hover:text-primary-600 font-sans text-lg transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className={`
                      "text-secondary-600 border-primary-500 hover:bg-primary-50 dark:text-secondary-100 dark:border-primary-400 dark:hover:bg-secondary-700"
                      ${loading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                      }
                    `}
                    
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    `{loading ? (
                      "Signing Out .."
                    ):
                    ("Sign Out")}`
                  </Button>
                </>
              )}
              {!user && (
                <button
                  onClick={() => {
                    setShowLoginModal(true)
                    setIsMobileMenuOpen(false)
                  }}
                  // className="bg-primary-600  font-semibold text-primary text-lg hover:bg-primary-600 font-sans"
                 className={`
                  max-lg w-12/12 py-3 rounded-xl font-semibold text-lg transition-all duration-200
                  ${user
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                  }
                `}
                  aria-label="Login"
                >
                  Login
                  </button>
                  // Login
                // </Button>
              )}
            </div>
          </nav>
        )}
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}