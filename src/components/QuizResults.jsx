import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ShieldAlert, 
  RotateCcw, 
  FileText, 
  ListOrdered,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const QuizResults = ({ 
  result, 
  onOpenCertificate, 
  onOpenLeaderboard, 
  onRetake 
}) => {
  const {
    student,
    score,
    maxScore,
    correctCount,
    wrongCount,
    unansweredCount,
    percentage,
    timeTakenSec,
    cheatingDetected,
    disqualificationReason,
    detailedResults
  } = result;

  const isPassed = percentage >= 60 && !cheatingDetected;

  useEffect(() => {
    if (isPassed && !cheatingDetected) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPassed, cheatingDetected]);

  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Cheating Banner if Disqualified */}
      {cheatingDetected && (
        <div className="rounded-3xl bg-rose-950/40 border border-rose-500/50 p-6 sm:p-8 text-center space-y-3 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white">ASSESSMENT DISQUALIFIED</h2>
          <p className="text-rose-300 text-sm max-w-lg mx-auto">
            Reason: <span className="font-bold underline">{disqualificationReason}</span>
          </p>
          <p className="text-xs text-slate-400">
            Anti-cheating security protocols automatically auto-submitted your assessment upon rule violation.
          </p>
        </div>
      )}

      {/* Main Score Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
        
        {/* Top Status Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-6 border" style={{
          backgroundColor: cheatingDetected ? 'rgba(244, 63, 94, 0.1)' : isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          borderColor: cheatingDetected ? 'rgba(244, 63, 94, 0.3)' : isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          color: cheatingDetected ? '#f43f5e' : isPassed ? '#10b981' : '#f59e0b',
        }}>
          {cheatingDetected ? <ShieldAlert className="w-4 h-4" /> : isPassed ? <Trophy className="w-4 h-4" /> : <Award className="w-4 h-4" />}
          <span>{cheatingDetected ? 'DISQUALIFIED' : isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}</span>
        </div>

        {/* Big Percentage Display with SVG Radial Ring Meter */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800/80 fill-none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(100, Math.max(0, percentage))) / 100}
                strokeLinecap="round"
                className="fill-none transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={cheatingDetected ? '#f43f5e' : isPassed ? '#10b981' : '#f59e0b'} />
                  <stop offset="100%" stopColor={cheatingDetected ? '#be123c' : isPassed ? '#6366f1' : '#d97706'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white tracking-tight">
                {Math.round(percentage)}<span className="text-2xl text-indigo-400">%</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-200 mt-4">
            Scored <span className="text-indigo-400 font-extrabold">{score}</span> / <span className="text-white font-bold">{maxScore}</span> marks
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8 text-left">
          
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Correct</span>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-black text-emerald-400">{correctCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Incorrect</span>
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span className="text-xl font-black text-rose-400">{wrongCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Unanswered</span>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-black text-amber-400">{unansweredCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90 shadow-md">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Time Spent</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-black text-slate-200">{formatMinutes(timeTakenSec)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-800/80 pt-6">
          
          {!cheatingDetected && isPassed && (
            <button
              onClick={onOpenCertificate}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Download Certificate</span>
            </button>
          )}

          <button
            onClick={onOpenLeaderboard}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all"
          >
            <ListOrdered className="w-4 h-4 text-amber-400" />
            <span>View Leaderboard</span>
          </button>

          <button
            onClick={onRetake}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Retake Test</span>
          </button>

        </div>

      </div>

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Detailed Review</span>
        </h3>

        <div className="space-y-4">
          {detailedResults.map((item, idx) => {
            const { question, userChoice, isCorrect, isAnswered } = item;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <div 
                key={question.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  !isAnswered
                    ? 'border-slate-800'
                    : isCorrect
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-400">
                    Q{idx + 1}. {question.topic} ({question.difficulty})
                  </span>
                  
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    !isAnswered
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : isCorrect
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {!isAnswered ? 'Skipped' : isCorrect ? 'Correct (+4)' : 'Incorrect'}
                  </span>
                </div>

                {/* Question text */}
                <p className="text-sm sm:text-base font-bold text-white mb-4">
                  {question.text}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {question.options.map((opt, optIdx) => {
                    const isUserPick = userChoice === optIdx;
                    const isCorrectPick = question.correctOptionIndex === optIdx;

                    let optionStyle = "bg-slate-800/60 border-slate-700 text-slate-300";
                    if (isCorrectPick) {
                      optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                    } else if (isUserPick && !isCorrect) {
                      optionStyle = "bg-rose-500/20 border-rose-500 text-rose-200 font-bold";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                      >
                        <span>
                          <strong className="mr-1.5">[{letters[optIdx]}]</strong> {opt}
                        </span>
                        {isCorrectPick && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />}
                        {isUserPick && !isCorrectPick && <XCircle className="w-4 h-4 text-rose-400 ml-2 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-indigo-400 block mb-1">Explanation:</span>
                  {question.explanation}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
