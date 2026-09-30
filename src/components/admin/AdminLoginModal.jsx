import React, { useState } from 'react';
import { Lock, User, KeyRound, X, ShieldCheck } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid Admin credentials! Try username: admin and password: admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Administrator Login</h2>
          <p className="text-xs text-slate-400">Sign in to manage questions, leaderboard, and settings.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-center">
            Default credentials: Username: <strong className="text-indigo-300">admin</strong> • Password: <strong className="text-indigo-300">admin123</strong>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate Admin</span>
          </button>

        </form>

      </div>
    </div>
  );
};
