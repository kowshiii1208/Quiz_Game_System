import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  X, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  Fingerprint
} from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess, customPassword = '' }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Reset modal state whenever opened/closed
  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsAuthenticating(false);
    } else {
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticating) return;

    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (!u || !p) {
      setError('Please enter both Faculty Username and Passkey.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    setTimeout(() => {
      const validCustom = customPassword && p === customPassword;
      if (u === 'admin' && (p === 'admin123' || validCustom)) {
        setIsAuthenticating(false);
        setPassword('');
        onLoginSuccess();
      } else {
        setIsAuthenticating(false);
        setError('Access Denied: Invalid credentials. Default is admin / admin123.');
      }
    }, 350);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] space-y-6 relative overflow-hidden"
      >
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all z-10"
          title="Close Login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Aditya University • Faculty Portal</span>
          </div>

          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 animate-pulse opacity-40 blur-md" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl">
              <Fingerprint className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Administrator Gateway</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage custom quizzes, QR exams, Excel reports, and question banks.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Faculty Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter username (e.g. admin)"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium pr-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Security Passkey</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-indigo-300 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-medium animate-slide-up">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials Bar */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400">
              Demo Access: <strong className="text-indigo-300 font-mono">admin</strong> / <strong className="text-indigo-300 font-mono">admin123</strong>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold transition-all shrink-0"
            >
              Auto-Fill
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-70 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Security Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Control Center</span>
              </>
            )}
          </button>

        </form>

        <div className="text-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-center space-x-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Protected Session • CSE Assessment Command Center</span>
        </div>

      </div>
    </div>
  );
};
