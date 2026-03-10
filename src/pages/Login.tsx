import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { initialUsers } from '../data/mockData';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  // Ensure dark mode is set by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const trimmedInput = username?.trim().toLowerCase() || '';
      const trimmedPassword = password?.trim() || '';

      const user = initialUsers.find(u =>
        (u.username.toLowerCase() === trimmedInput || u.email.toLowerCase() === trimmedInput) &&
        u.password.toLowerCase() === trimmedPassword.toLowerCase()
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Mock token for client-side only
      const mockToken = `mock-token-${user.id}-${Date.now()}`;

      const userData = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
        email: user.email
      };

      login(mockToken, userData);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative font-sans">
      {/* Fixed Background Image */}
      <img
        src="https://cdn.dribbble.com/userupload/45261316/file/82db561b5ced954d82f92fab7b3d05f0.jpg?resize=1849x858&vertical=center"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Dark Overlay for better contrast */}
      <div className="fixed inset-0 bg-black/20 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] mx-4"
      >
        <div className="relative rounded-[2rem] bg-[#0f172a]/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-10 pt-16 pb-12">

          {/* Top Tab for "Login" */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#e2e8f0] rounded-b-2xl px-14 py-3 shadow-md z-20">
            <h2 className="text-2xl font-medium text-black tracking-wide">Login</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            {/* Username Input */}
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border border-white/60 rounded-full px-6 py-3.5 text-white placeholder-white focus:outline-none focus:border-white focus:bg-white/5 transition-all"
                placeholder="Username"
                required
              />
              <User className="absolute right-6 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-white/60 rounded-full px-6 py-3.5 text-white placeholder-white focus:outline-none focus:border-white focus:bg-white/5 transition-all pr-24"
                placeholder="Password"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3 text-white">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white/80 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm text-white px-1 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-4 h-4 border border-white bg-transparent rounded-sm checked:bg-white cursor-pointer transition-colors"
                  />
                  <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="group-hover:text-white/80 transition-colors">Remember me</span>
              </label>
              <a href="#" className="hover:text-white/80 transition-all">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e2e8f0] text-black font-semibold rounded-full py-3.5 mt-4 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-md"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-white mt-8">
              Don't have an account?{' '}
              <a href="#" className="font-bold hover:underline transition-all">
                Register
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
