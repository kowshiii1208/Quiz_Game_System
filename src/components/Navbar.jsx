import React from 'react';
import { ShieldCheck, Trophy, Lock, LogOut, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

export const Navbar = ({ 
  currentStep, 
  onOpenLeaderboard, 
  onOpenAdmin, 
  isAdminLoggedIn, 
  onAdminLogout,
  onResetQuiz,
  activeStudent 
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={currentStep !== 'QUIZ' ? onResetQuiz : undefined}
          className={`flex items-center space-x-3 ${currentStep !== 'QUIZ' ? 'cursor-pointer hover:opacity-90' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent font-sans">
                QuizMaster<span className="text-indigo-400">PRO</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.0 Web
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Interactive Assessment Platform</p>
          </div>
        </div>

        {/* Center Banner / Status (If student active) */}
        {currentStep === 'QUIZ' && activeStudent && (
          <div className="hidden md:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Anti-Cheat Mode Active • Do Not Switch Tabs or Exit Fullscreen</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Public Leaderboard Button */}
          {currentStep !== 'QUIZ' && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
          )}

          {/* Admin Login / Dashboard Button */}
          {currentStep !== 'QUIZ' && (
            isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="Logout Admin"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all"
              >
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Admin Login</span>
              </button>
            )
          )}

          {/* Abort Quiz Button if inside active Quiz */}
          {currentStep === 'QUIZ' && (
            <button
              onClick={onResetQuiz}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quit Quiz</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
