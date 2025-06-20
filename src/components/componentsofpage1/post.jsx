import React, { useState, useEffect } from "react";
import { Trophy, Star, Crown, Medal, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

const API_URL = import.meta.env.VITE_API_URL;

function AApp({ user }) {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        console.log("Current user:", user);

        const topUsersResponse = await fetch(`${API_URL}/daily-top`);
        console.log("Top users response status:", topUsersResponse.status);
        
        if (!topUsersResponse.ok) {
          throw new Error(`HTTP error! status: ${topUsersResponse.status}`);
        }
        
        const topUsersData = await topUsersResponse.json();
        console.log("Top users data:", topUsersData);
        
        setTopUsers(topUsersData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 1: return <Medal className="w-8 h-8 text-gray-400" />;
      case 2: return <Award className="w-8 h-8 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-pink-500" />;
    }
  };

  const getRankBadge = (index) => {
    const badges = [
      "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg",
      "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg", 
      "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg",
    ];
    return badges[index] || "bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg";
  };

  const getRankTitle = (index) => {
    const titles = [
      'Style Queen 👑',
      'Trendsetter ⭐',
      'Fashion Star ✨',
    ];
    return titles[index] || 'Style Enthusiast';
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-16">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading style rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-8">
        <Card className="max-w-2xl mx-auto text-center p-12">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Oops!</h3>
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto py-4 px-2 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Style Champions
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Today's top-rated fashion influencers
        </p>
      </div>
      {/* Minimalistic Rankings */}
      {topUsers.length === 0 ? (
        <Card className="w-full text-center p-8">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-gray-400">—</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No rankings yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Be the first to rate outfits and climb the leaderboard!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <Card 
              key={`${user.displayName}-${index}`} 
              className="user-card w-full p-3 flex items-center gap-3"
            >
              <div className="text-lg font-bold text-gray-500 w-6 text-center">
                {index + 1}
              </div>
              <Avatar className="w-10 h-10 ring-1 ring-gray-200 dark:ring-gray-700">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="text-base font-bold">
                  {user.displayName?.charAt(0) || '👤'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.displayName || 'Anonymous'}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {user.averageDailyRating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-xs text-gray-400">avg rating</div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Footer note */}
      <div className="text-center pt-6">
        <Card className="w-full p-2 bg-gray-50 dark:bg-gray-900/20">
          <CardContent className="text-xs text-gray-500 dark:text-gray-400 font-medium p-0">
            Rankings update in real-time based on daily ratings
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AApp;