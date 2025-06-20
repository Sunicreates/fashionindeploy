import React, { useState, useEffect } from 'react';
import Navbar from './components/j.js/Mainnav';
import Feed from './components/componentsofpage1/feed';
import Sidebar from './components/componentsofpage1/sidebar';
import AApp from './components/componentsofpage1/post';
import Blogform from './components/componentsofpage1/DressForm';
import Homepage from './components/componentsofpage1/homepage';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

function M1({ user }) {
  const [mode, setMode] = useState("home");
  const [sidebarvisible, setSidebarvisible] = useState(false);
  const [Posts, setPosts] = useState([]);

  const togglesidebar = () => {   
    setSidebarvisible(!sidebarvisible);
  }

  const handlechange = (newMode) => {
    if (mode === newMode) {
      setMode('home');
    } else {
      setMode(newMode);
    }
    setSidebarvisible(false);
  }

  const handleSubmit = async (newPost) => {
    if (!user) {
      console.error("User is not logged in.");
      return;
    }
    
    const formData = new FormData();
    formData.append('image', newPost.img);
    
    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous User',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified || false,
      isAnonymous: user.isAnonymous || true,
      providerData: user.providerData || [],
      stsTokenManager: user.stsTokenManager || {},
      lastLoginAt: user.lastLoginAt || new Date().toISOString(),
      apiKey: user.apiKey || '',
      appName: user.appName || 'roadrage'
    };
    
    formData.append('user', JSON.stringify(userData));
    formData.append('posts', JSON.stringify([{
      postId: newPost.postId,
      description: newPost.description,
      tags: newPost.tags,
      caption: newPost.caption
    }]));

    try {
      const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const result = await response.json();
      setPosts(prevPosts => [...result.data, ...prevPosts]);
      
      // Switch to feed after successful post
      setMode('feed');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + error.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar togglesidebar={togglesidebar} user={user} />
      <Sidebar mode={mode} setMode={handlechange} show={sidebarvisible} />
       
      <main className={`
        transition-all duration-300 pt-16
        ${sidebarvisible ? 'lg:ml-80' : 'lg:ml-0'}
      `}>
        {mode === 'create' && <Blogform onSubmit={handleSubmit} />}
        {mode === 'feed' && (
          Posts.length > 0 
            ? <Feed posts={Posts} setPosts={setPosts} user={user} />
            : (
              <div className="container-responsive py-8">
                <Card className="max-w-2xl mx-auto text-center p-16">
                  <CardContent className="space-y-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-4xl">👗</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Your feed is empty</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Start sharing your amazing outfits with the community!</p>
                      <Button 
                        onClick={() => setMode('create')}
                        size="lg"
                        className="group"
                      >
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Create Your First Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
        )}
        {mode === 'rank' && <AApp user={user} setPosts={setPosts} />}
        {mode === 'home' && <Homepage user={user} />}
      </main>
    </div>
  );
}

export default M1;