'use client'

import { useEffect, useState } from 'react'
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
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Home, 
  Settings, 
  LogIn,
  LogOut,
  Crown,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  currentPage?: string;
}


const Header: React.FC<HeaderProps> = ({ 
  currentPage = 'home',
}) =>{
  const { user, signOut, authLoading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true);
    await signOut()
    setIsMobileMenuOpen(false)
    router.push(`/`);
    setLoading(false);
  }



 useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(user ? [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
      ...(user.role == 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : [])
    ] : [])
  ];

  const handleNavClick = (pageId: string) => {
    // onNavigate(pageId);
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  };

  const handleBookNow = () => {
    // onNavigate('booking');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowUserDropdown(false);
  };
 // Show nothing (or a placeholder) while auth is loading
  if (authLoading) {
    return (
      <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16 md:h-20">
      {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center border-2 border-red-400/50">
            <Link href='/'> <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" /></Link>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black text-white">
              CRICKET<span className="text-red-500">ARENA</span>
            </h1>
            <p className="text-xs text-red-300 font-medium">CHAMPIONSHIP GROUND</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

 return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md border-b border-red-500/30 shadow-lg' 
          : 'bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center border-2 border-red-400/50">
                <Link href='/'> <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" /></Link>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  CRICKET<span className="text-red-500">ARENA</span>
                </h1>
                <p className="text-xs text-red-300 font-medium">CHAMPIONSHIP GROUND</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      isActive
                        ? 'text-white bg-red-600/20 border border-red-500/50'
                        : 'text-gray-300 hover:text-white hover:bg-red-600/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Book Now Button - Always Visible */}
              {/* <button
                onClick={handleBookNow}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 inline" />
                <span className="hidden sm:inline">CLAIM PITCH</span>
                <span className="sm:hidden">BOOK</span>
              </button> */}

              {/* User Actions */}
              {user ? (
                <div className="relative">
                  {/* Desktop User Menu */}
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="hidden lg:flex items-center space-x-2 bg-black/60 border border-red-500/30 rounded-lg px-3 py-2 hover:border-red-500/60 transition-all duration-300"
                  >
                    {user.name ? (
                      <img 
                        src={user.name} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-red-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-white font-medium">{user.name.split(' ')[0]}</span>
                    {user.role == 'admin' && <Crown className="w-4 h-4 text-red-400" />}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-red-500/30 rounded-lg shadow-2xl py-2">
                      <div className="px-4 py-2 border-b border-red-500/20">
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-red-300 text-sm">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        disabled={authLoading}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-red-600/20 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}

                  {/* Mobile Menu Button */}
                  <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden bg-black/60 border border-red-500/30 text-white p-2 rounded-lg hover:border-red-500/60 transition-all duration-300"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                /* Login Button for Non-Logged Users */
                <button
                  onClick={()=>{setShowLoginModal(true)}}
                  className="bg-black/60 border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                  <span>LOGIN</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Animated Red Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
      </header>

      {/* Mobile Slide-Out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-black to-gray-900 border-l border-red-500/30 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            
            {/* Menu Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-xl">MENU</h3>
                {user && (
                  <div className="flex items-center mt-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      {user.role == 'admin' && (
                        <div className="flex items-center">
                          <Crown className="w-3 h-3 text-red-200 mr-1" />
                          <span className="text-red-200 text-xs">ADMIN</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-red-600/20 border border-transparent hover:border-red-500/30'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.id === 'admin' && <Crown className="w-4 h-4 ml-auto text-red-400" />}
                  </button>
                );
              })}

              {/* Book Now in Mobile Menu */}
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
              >
                <Calendar className="w-5 h-5 mr-3 inline" />
                CLAIM YOUR PITCH
              </button>

              {/* Logout for Mobile */}
              {user && (
                <button
                  onClick={handleSignOut}
                  disabled={authLoading}
                  className={`
                    w-full flex items-center space-x-4 p-4 mt-6 border-t border-red-500/20 text-gray-400 hover:text-red-400 transition-colors duration-300
                    ${authLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:scale-105 transition-all duration-300'}
                    `}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;