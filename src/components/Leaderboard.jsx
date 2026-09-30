import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  X, 
  Award, 
  CheckCircle2,
  Building2,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export const Leaderboard = ({ 
  leaderboard, 
  onClose, 
  isAdmin, 
  onDeleteEntry, 
  onClearLeaderboard 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredRecords = leaderboard.filter((rec) => {
    const matchesSearch = 
      rec.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.student.college.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'ALL' || rec.student.difficulty === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // Non-disqualified first, then higher score, then lower time
    if (a.cheatingDetected !== b.cheatingDetected) {
      return a.cheatingDetected ? 1 : -1;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeTakenSec - b.timeTakenSec;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>Assessment Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-400">Live ranking of all candidate attempts and performance</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && leaderboard.length > 0 && (
              <button
                onClick={onClearLeaderboard}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls: Search & Level Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-slate-800/80">
          
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name, roll number, or college..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs appearance-none bg-slate-900"
            >
              <option value="ALL">All Quiz Levels</option>
              <option value="EASY">Easy Level</option>
              <option value="MEDIUM">Medium Level</option>
              <option value="HARD">Hard Level</option>
              <option value="MIXED">Mixed Level</option>
            </select>
          </div>

        </div>

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {sortedRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto opacity-40" />
              <p className="text-sm font-semibold">No assessment records found.</p>
              <p className="text-xs text-slate-500">Be the first candidate to take the quiz!</p>
            </div>
          ) : (
            sortedRecords.map((rec, index) => {
              const { student, score, maxScore, percentage, timeTakenSec, cheatingDetected, timestamp, id } = rec;
              const rank = index + 1;

              let rankBadge = "bg-slate-800 text-slate-400 border-slate-700";
              if (rank === 1 && !cheatingDetected) rankBadge = "bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30";
              else if (rank === 2 && !cheatingDetected) rankBadge = "bg-slate-300/20 text-slate-200 border-slate-300/40";
              else if (rank === 3 && !cheatingDetected) rankBadge = "bg-amber-700/20 text-amber-400 border-amber-700/40";

              return (
                <div
                  key={id || index}
                  className={`glass-card rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    cheatingDetected ? 'border-rose-500/30 bg-rose-950/10' : 'border-slate-800'
                  }`}
                >
                  {/* Left: Rank & Candidate Details */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center border shrink-0 ${rankBadge}`}>
                      {rank === 1 && !cheatingDetected ? '🥇' : rank === 2 && !cheatingDetected ? '🥈' : rank === 3 && !cheatingDetected ? '🥉' : rank}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{student.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {student.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center space-x-2">
                        <span>Roll: <strong className="text-slate-200">{student.rollNumber}</strong></span>
                        <span>•</span>
                        <span className="truncate max-w-[180px]">{student.college}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Score, Status & Admin Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    
                    {/* Score */}
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-extrabold text-white">
                        {score} / {maxScore} <span className="text-indigo-400">({Math.round(percentage)}%)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500 inline" />
                        <span>{Math.round(timeTakenSec)}s</span>
                        <span>•</span>
                        <span>{timestamp}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {cheatingDetected ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center space-x-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Disqualified</span>
                        </span>
                      ) : percentage >= 60 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          Failed
                        </span>
                      )}
                    </div>

                    {/* Admin Delete Entry */}
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteEntry(id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
