import React from 'react';
import { Home, Plus, Heart, Trophy, TrendingUp, X, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

function Sidebar({ mode, setMode, show }) {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', color: 'from-pink-200 to-pink-300' },
    { id: 'create', icon: Plus, label: 'Create Post', color: 'from-pink-300 to-pink-400' },
    { id: 'feed', icon: Heart, label: 'My Feed', color: 'from-pink-200 to-pink-400' },
    { id: 'rank', icon: Trophy, label: 'Rankings', color: 'from-yellow-200 to-yellow-300' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {show && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setMode('home')}
        />
      )}
      {/* Mobile Drawer Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 z-50
        glass-sidebar
        transform transition-all duration-300 ease-in-out
        ${show ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode('home')}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {/* Navigation Menu */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = mode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'glass-bg shadow-lg border border-pink-200/30' 
                      : 'hover:glass-bg-alt hover:shadow-md'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-all duration-300 shadow-sm
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-pink-700 shadow-md scale-105` 
                      : 'bg-white/50 text-pink-500 group-hover:scale-105 group-hover:bg-white/70'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`
                    font-medium transition-colors duration-300 tracking-wide text-sm
                    ${isActive 
                      ? 'text-pink-700' 
                      : 'text-pink-500 group-hover:text-pink-700'
                    }
                  `}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          {/* Trending Section */}
          <Card className="mt-auto p-4 glass-bg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-medium text-pink-600">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span>Trending Now</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {['#SummerVibes', '#OOTD', '#Vintage', '#Chic'].map((tag) => (
                  <span
                    key={tag}
                    className="tag text-xs px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-pink-400">
                Join the conversation and discover what's hot in fashion!
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Sidebar;