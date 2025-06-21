import React, { useState } from 'react';
import { signInWithGoogle, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Heart, Camera, Star, Users, Sparkles, TrendingUp, Share2, MessageCircle, Menu, Search } from 'lucide-react';

// Animated Dress Icon (SVG)
function AnimatedDress() {
  return (
    <svg className="absolute left-8 top-20 w-16 h-16 animate-float-dress opacity-30 z-0" viewBox="0 0 64 64" fill="none">
      <path d="M32 8 L40 28 L24 28 Z" fill="#FEC1D8" />
      <ellipse cx="32" cy="44" rx="16" ry="20" fill="#FFE6F2" />
      <ellipse cx="32" cy="44" rx="12" ry="16" fill="#FEC1D8" />
    </svg>
  );
}
// Animated Camera Icon
function AnimatedCamera() {
  return (
    <div className="absolute right-8 top-32 animate-float-camera opacity-30 z-0">
      <Camera className="w-14 h-14 text-pink-400" />
    </div>
  );
}
// Animated Spotlight (SVG)
function AnimatedSpotlight() {
  return (
    <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-40 h-20 animate-spotlight opacity-20 z-0" viewBox="0 0 200 60" fill="none">
      <ellipse cx="100" cy="30" rx="90" ry="20" fill="#FEC1D8" />
      <ellipse cx="100" cy="40" rx="70" ry="10" fill="#FFE6F2" />
    </svg>
  );
}

export default function LandingPage({ setUser }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleclick = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      setUser(user);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          useremail: user.email ?? null,
          username: user.displayName ?? null,
          userphoto: user.photoURL ?? null,
          totalLikes: 0,
          totalPosts: 0,
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile-only overlay for desktop/tablet users */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-lg text-center px-6 md:px-0 lg:px-0 select-none pointer-events-auto block md:hidden lg:hidden" style={{display: 'none'}} id="mobile-only-overlay">
        <div className="max-w-xs mx-auto">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-2">
              <rect x="14" y="6" width="36" height="52" rx="8" fill="#FEC1D8" />
              <rect x="18" y="10" width="28" height="44" rx="6" fill="#fff" />
              <circle cx="32" cy="54" r="2" fill="#FEC1D8" />
            </svg>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">Mobile Only</h2>
            <p className="text-pink-700 text-base">Fashion City is exclusive to mobile devices.<br/>Please visit on your phone for the best experience!</p>
          </div>
        </div>
      </div>
      <div className="block md:hidden lg:hidden">
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 overflow-hidden relative font-sans">
          {/* Parallax/Particles: All pinks, no blue */}
          <div className="parallax-mobile"></div>
          <div className="mobile-particles">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="mobile-particle bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 12}s`,
                  animationDuration: `${12 + Math.random() * 8}s`
                }}
              />
            ))}
          </div>
          {/* Sparkle container (pink) */}
          <div className="sparkle-container fixed inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="sparkle bg-pink-200"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${8 + Math.random() * 4}s`
                }}
              />
            ))}
      </div>
          {/* Animated Dress, Camera, Spotlight */}
          <AnimatedDress />
          <AnimatedCamera />
          <AnimatedSpotlight />
          {/* Sleek mobile header */}
          <header className="relative z-10 mobile-header">
            <nav className="glass-nav-mobile mx-3 mt-3 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="glass-button p-2.5">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-700 to-pink-400 bg-clip-text text-transparent">Fashion City</span>
                </div>
                <div className="flex items-center space-x-2">
                      
                </div>
              </div>
            </nav>
          </header>
          {/* Hero section with smoking shadow effect */}
          <section className="relative z-10 text-center px-4 pt-8 pb-6">
            <div className="max-w-sm mx-auto relative">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-700 to-pink-400 bg-clip-text text-transparent leading-tight">
                Share Your Style Journey ✨
                </h1>
              <div className="glass-card-mobile p-6 mb-8 card-hover-mobile smoking-shadow relative overflow-visible">
                <p className="text-base text-pink-700 leading-relaxed mb-4">
                  Post your outfits, get feedback from fashion lovers, and discover trending styles!
                </p>
                <Button size="lg" className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold text-base py-3 rounded-xl" onClick={handleclick} disabled={isLoading}>
                  <Camera className="mr-2 h-5 w-5" />
                  {isLoading ? 'Signing in...' : 'Share Your Look'}
                </Button>
                {/* Smoking shadow effect */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-10 pointer-events-none z-0">
                  <svg width="100%" height="100%" viewBox="0 0 160 40" fill="none">
                    <defs>
                      <radialGradient id="smoke" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#FEC1D8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="80" cy="20" rx="70" ry="12" fill="url(#smoke)" className="animate-smoke" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          {/* Streamlined feature cards */}
          <section className="relative z-10 px-4 mb-8">
            <div className="space-y-4 max-w-sm mx-auto">
              <Card className="glass-card-mobile p-5 card-hover-mobile">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Star className="h-6 w-6 text-white animate-spin-slow" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold mb-1 text-pink-800">Rate & Review</h3>
                    <p className="text-pink-600 text-sm leading-relaxed">
                      Give feedback and help fellow fashionistas shine!
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="glass-card-mobile p-5 card-hover-mobile">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Share2 className="h-6 w-6 text-white animate-bounce" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold mb-1 text-pink-800">Share Instantly</h3>
                    <p className="text-pink-600 text-sm leading-relaxed">
                      Upload your daily outfits and inspire others.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="glass-card-mobile p-5 card-hover-mobile">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Users className="h-6 w-6 text-white animate-float-users" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold mb-1 text-pink-800">Connect & Inspire</h3>
                    <p className="text-pink-600 text-sm leading-relaxed">
                      Follow influencers and build your community.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
          {/* Refined stats section */}
          <section className="relative z-10 px-4 mb-8">
            <div className="max-w-sm mx-auto">
              <div className="glass-card-mobile p-6 card-hover-mobile">
                <h2 className="text-lg font-bold mb-4 text-center text-pink-800">
                  Join Our Community
                </h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-pink-700">Create</div>
                    <div className="text-pink-500 text-xs font-medium">Style Posts</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-pink-700">Become</div>
                    <div className="text-pink-500 text-xs font-medium">Fashion Lovers</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Enhanced community CTA */}
          <section className="relative z-10 px-4 mb-8">
            <div className="max-w-sm mx-auto">
              <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-6 rounded-3xl text-center text-white card-hover-mobile relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-3">
                    Ready to Get Started?
                  </h2>
                  <p className="text-sm mb-5 opacity-90 leading-relaxed">
                    Connect with style mavens and showcase your unique fashion sense!
                  </p>
                  <Button size="lg" className="w-full bg-white text-pink-600 font-semibold hover:bg-pink-50" onClick={handleclick} disabled={isLoading}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {isLoading ? 'Signing in...' : 'Join Now'}
                  </Button>
          </div>
        </div>
      </div>
          </section>
          {/* Animations and effects */}
          <style>{`
            @keyframes float-dress {
              0%, 100% { transform: translateY(0) rotate(-5deg); }
              50% { transform: translateY(-16px) rotate(5deg); }
            }
            .animate-float-dress { animation: float-dress 6s ease-in-out infinite; }
            @keyframes float-camera {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(-10deg); }
            }
            .animate-float-camera { animation: float-camera 7s ease-in-out infinite; }
            @keyframes spotlight {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.5; }
            }
            .animate-spotlight { animation: spotlight 4s ease-in-out infinite; }
            @keyframes smoke {
              0% { opacity: 0.3; }
              50% { opacity: 0.7; }
              100% { opacity: 0.3; }
            }
            .animate-smoke { animation: smoke 3s ease-in-out infinite; }
            @keyframes float-users {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            .animate-float-users { animation: float-users 5s ease-in-out infinite; }
            .mobile-particle {
              background: linear-gradient(135deg, #FEC1D8 0%, #FFE6F2 100%);
            }
            .sparkle {
              background: #FEC1D8;
            }
          `}</style>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #mobile-only-overlay { display: flex !important; }
          .block.md\\:hidden, .block.lg\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
