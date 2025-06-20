import React from 'react';
import { Menu, Bell, Search, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import ThemeToggle from '../../components/ThemeToggle';

function Navbar({ togglesidebar, user }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglesidebar}
              className="lg:hidden glass-hover"
            >
              <Menu className="w-6 h-6" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass-bg rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xl font-light text-gray-700 tracking-wide">
                Fashion City
              </span>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search styles, users, trends..."
                className="input-elegant pl-12 pr-4 py-3 text-sm w-full"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative glass-hover">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></span>
            </Button>

            <ThemeToggle />

            {user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-pink-200/30">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;