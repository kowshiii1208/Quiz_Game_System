import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Maximize, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const InstructionsModal = ({ 
  student, 
  settings, 
  questionCount, 
  onStartQuiz, 
  onBack 
}) => {
  const totalTimeMinutes = Math.ceil((settings.timePerQuestionSec * questionCount) / 60);

  const handleStartQuizWithFullscreen = async () => {
    // Synchronous Request Fullscreen directly on user click gesture
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request bypassed or blocked:", err);
    }
    
    // Proceed to quiz step
    onStartQuiz();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Examination Guidelines</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Assessment Instructions</h1>
        <p className="text-xs sm:text-sm text-slate-400">Please review the rules before starting your assessment.</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-800">
        
        {/* Candidate Profile Summary Box */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Name:</span>
            <span className="text-white font-bold text-sm truncate block">{student.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Roll Number:</span>
            <span className="text-indigo-400 font-bold text-sm truncate block">{student.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">College:</span>
            <span className="text-slate-200 font-semibold text-sm truncate block">{student.college}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Level:</span>
            <span className="text-amber-400 font-bold text-sm block">{student.difficulty}</span>
          </div>
        </div>

        {/* Assessment Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <HelpCircle className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-white block">{questionCount}</span>
            <span className="text-[11px] text-slate-400 font-medium">Questions</span>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-white block">{totalTimeMinutes} Mins</span>
            <span className="text-[11px] text-slate-400 font-medium">Duration</span>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-emerald-400 block">+{settings.marksPerQuestion}</span>
            <span className="text-[11px] text-slate-400 font-medium">Per Question</span>
          </div>
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-rose-400 block">-{settings.allowNegativeMarking ? settings.negativeMarks : 0}</span>
            <span className="text-[11px] text-slate-400 font-medium">Negative</span>
          </div>
        </div>

        {/* Security & Anti-Cheat Rules Box */}
        <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-5 text-xs sm:text-sm text-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Anti-Cheat Guidelines</span>
          </div>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>
              <strong className="text-white">Fullscreen Mode:</strong> The assessment runs in fullscreen mode.
            </li>
            <li>
              <strong className="text-white">Copying Disabled:</strong> Text selection and right-click are disabled.
            </li>
            <li>
              <strong className="text-white">Tab Switching Monitored:</strong> Navigating away from this window will automatically submit your test.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-6">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            ← Back
          </button>

          <button
            onClick={handleStartQuizWithFullscreen}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <Maximize className="w-4 h-4" />
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
};
