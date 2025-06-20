import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

const API_URL = import.meta.env.VITE_API_URL;

function Feed({ posts, setPosts, user }) {
  const [loading, setLoading] = useState(false);

  const handleRating = async (postId, rating) => {
    if (!user) {
      alert("Please log in to rate posts");
      return;
    }

    try {
      setLoading(true);
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

      // Refresh posts after rating
      const postsResponse = await fetch(`${API_URL}/posts`);
      const postsData = await postsResponse.json();
      setPosts(postsData);

    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="container-responsive py-8">
        <Card className="max-w-2xl mx-auto text-center p-12">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Be the first to share your style!</p>
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
        <div className="flex items-center justify-center gap-3 mb-4">
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            My Feed
          </h2>
        </div>

      </div>
      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.postId} className="post-card w-full">
            <CardHeader className="border-b border-pink-200/30 dark:border-pink-800/30">
              <div className="flex items-center gap-3">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{post.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}
                  </p>
                </div>
                {post.averageRating > 0 && (
                  <div className="status-badge ml-auto">
                    <Star className="w-3 h-3 mr-1" />
                    {post.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 shadow-inner">
                  {post.img ? (
                    <img
                      src={post.img}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {post.caption}
                  </h4>
                  {post.description && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </div>
                {post.tags && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, i) => (
                      <span key={i} className="tag text-xs">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
               
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Feed;
