import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './components/ui/theme-provider';
import M1 from './Mainpage.jsx';
import LandingPage from './components/auth/Mainlanding.jsx';
import './index.css';

function App() {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userdata");
    if (storedUser) {
      setUserdata(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  useEffect(() => {
    if (userdata) {
      localStorage.setItem("userdata", JSON.stringify(userdata));
    }
  }, [userdata]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading Fashion City...</p>
        </div>
      </div>
    ); 
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="fashion-city-theme">
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage setUser={setUserdata} />} />
            <Route path="/dashboard" element={<M1 user={userdata} />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;