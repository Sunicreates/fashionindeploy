import React, { useState, useEffect } from 'react';
import { Heart, Star, TrendingUp, Users, Sparkles, Crown, Award, FileText, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

const API_URL = import.meta.env.VITE_API_URL;

function Homepage({ user }) {
  const [randomPosts, setRandomPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState({});
  const [menuOpen, setMenuOpen] = useState({});

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const posts = await response.json();
        
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setRandomPosts(selected);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching random posts:", error);
        setLoading(false);
      }
    };

    fetchRandomPosts();
    const intervalId = setInterval(fetchRandomPosts, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRating = async (postId, rating) => {
    if (!user) {
      alert("Please log in to rate posts");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: user.uid,
          rating,
          displayName: user?.displayName || user?.username,
          email: user.email 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit rating");
      }

      const postsResponse = await fetch(`${API_URL}/posts`);
      const postsData = await postsResponse.json();
      const shuffled = [...postsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setRandomPosts(selected);

    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(error.message);
    }
  };

  // Delete post handler
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      // Call your API to delete the post
      await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' });
      setRandomPosts((prev) => prev.filter((p) => p.postId !== postId));
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-16">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading amazing styles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto py-4 px-2 space-y-8">
      {/* Welcome Section */}

      {/* Featured Posts */}
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-700">
            Trending Styles
          </h2>

        </div>
        {randomPosts.length === 0 ? (
          <Card className="text-center p-8 w-full">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No posts yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to share your amazing style!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {randomPosts.map((post) => (
              <Card key={post.postId} className="post-card w-full">
                <CardHeader className="border-b border-pink-200/30 dark:border-pink-800/30">
                  <div className="flex items-center gap-3 relative">
                    <Avatar className="w-10 h-10 avatar-online">
                      <AvatarImage src={post.userphoto} alt={post.displayName} />
                      <AvatarFallback>
                        {post.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">
                        {post.displayName || 'Fashion Lover'}
                      </h3>
                    </div>
                    {post.averageRating > 0 && (
                      <div className="status-badge ml-auto">
                        <Star className="w-3 h-3 mr-1" />
                        {post.averageRating.toFixed(1)}
                      </div>
                    )}
                    {/* Ellipsis menu at right end, only for post owner */}
                    {user && post.userId === user.uid && (
                      <div className="ml-auto relative">
                        <button
                          className="p-1 rounded-full hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                          aria-label="More options"
                          onClick={() => setMenuOpen(prev => ({ ...prev, [post.postId]: !prev[post.postId] }))}
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        {menuOpen[post.postId] && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2"
                              onClick={() => { setMenuOpen(prev => ({ ...prev, [post.postId]: false })); handleDelete(post.postId); }}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Caption above image */}
                    <h4 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-2">
                      {post.caption}
                    </h4>
                    {/* IMAGE */}
                    <div className="relative group mb-2">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 shadow-inner">
                        {post.img ? (
                          <img
                            src={post.img}
                            alt={post.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* DESCRIPTION BELOW IMAGE */}
                    {post.description && expandedDesc[post.postId] && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2 animate-fade-in">
                        {post.description}
                      </p>
                    )}
                    {/* TAGS and DESCRIPTION BUTTON at right */}
                    {(post.tags || post.description) && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2 flex-1">
                          {post.tags && post.tags.split(',').map((tag, i) => (
                            <span key={i} className="tag text-xs">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                        {post.description && (
                          <button
                            className="ml-2 p-1 rounded-full hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            aria-label="Show description"
                            onClick={() => setExpandedDesc((prev) => ({ ...prev, [post.postId]: !prev[post.postId] }))}
                          >
                            <FileText className={`w-5 h-5 ${expandedDesc[post.postId] ? 'text-pink-500' : 'text-gray-400'}`} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-pink-500" />
                      <span className="font-bold text-xs text-pink-700">Rate this outfit</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      {[...Array(10)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleRating(post.postId, i + 1)}
                          className="rating-button text-xs"
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;