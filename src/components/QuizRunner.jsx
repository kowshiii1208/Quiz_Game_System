import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  ShieldAlert, 
  Send, 
  Grid,
  Maximize2,
  Lock,
  X,
  EyeOff
} from 'lucide-react';

export const QuizRunner = ({ 
  student, 
  questions, 
  settings, 
  onFinishQuiz 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: choiceIndex }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [timeLeft, setTimeLeft] = useState(questions.length * settings.timePerQuestionSec);
  const [showPalette, setShowPalette] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cheatingAlert, setCheatingAlert] = useState(null);
  const [isFullscreenActive, setIsFullscreenActive] = useState(true);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const timerRef = useRef(null);
  const quizSubmittedRef = useRef(false);

  // Fullscreen trigger helper
  const reEnterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullscreenActive(true);
    } catch (err) {
      console.warn("Fullscreen re-entry failed:", err);
    }
  };

  // Anti-Cheating Event Listeners & Keyboard Shortcut Blocking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowFocused(false);
        if (!quizSubmittedRef.current && settings.strictAntiCheat) {
          handleAntiCheatViolation("Browser Tab Switch / Window Switch Detected");
        }
      } else {
        setIsWindowFocused(true);
      }
    };

    const handleFullscreenChange = () => {
      const isFS = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreenActive(isFS);

      if (!isFS && !quizSubmittedRef.current && settings.strictAntiCheat) {
        handleAntiCheatViolation("Exited Fullscreen Mode during Assessment");
      }
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
      if (!quizSubmittedRef.current && settings.strictAntiCheat) {
        handleAntiCheatViolation("Window Focus Lost / App Switch Detected");
      }
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    // Block keyboard shortcuts (Ctrl+C, Ctrl+U, Ctrl+Shift+I, F12, PrintScreen)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        e.stopPropagation();
        alert("🔒 Security Alert: Keyboard copy shortcuts and Developer Tools are disabled during the assessment!");
        return false;
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [settings.strictAntiCheat]);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitQuiz(false, "Time Expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleAntiCheatViolation = (reason) => {
    if (quizSubmittedRef.current) return;
    setCheatingAlert(reason);
    setTimeout(() => {
      submitQuiz(true, reason);
    }, 1500);
  };

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const submitQuiz = (cheatingDetected = false, disqualificationReason = "") => {
    if (quizSubmittedRef.current) return;
    quizSubmittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    // Exit fullscreen cleanly
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const timeTakenSec = (questions.length * settings.timePerQuestionSec) - timeLeft;

    // Calculate score
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    const detailedResults = questions.map((q) => {
      const selectedIndex = userAnswers[q.id];
      const isAnswered = selectedIndex !== undefined;
      const isCorrect = isAnswered && selectedIndex === q.correctOptionIndex;

      if (isAnswered) {
        if (isCorrect) {
          totalScore += settings.marksPerQuestion;
          correctCount++;
        } else {
          if (settings.allowNegativeMarking) {
            totalScore -= settings.negativeMarks;
          }
          wrongCount++;
        }
      }

      return {
        question: q,
        userChoice: selectedIndex,
        isCorrect,
        isAnswered
      };
    });

    const maxScore = questions.length * settings.marksPerQuestion;
    const finalScore = Math.max(0, totalScore);
    const percentage = maxScore > 0 ? (finalScore / maxScore) * 100 : 0;

    onFinishQuiz({
      student,
      score: finalScore,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount: questions.length - (correctCount + wrongCount),
      percentage,
      timeTakenSec,
      cheatingDetected,
      disqualificationReason,
      detailedResults
    });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="min-h-[calc(100vh-80px)] flex flex-col justify-between max-w-6xl mx-auto px-4 py-4 sm:py-6 select-none"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      
      {/* Cheating Alert Overlay */}
      {cheatingAlert && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-rose-950 border border-rose-500 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl animate-bounce">
            <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-extrabold text-white">CHEATING VIOLATION DETECTED!</h2>
            <p className="text-rose-200 text-sm">{cheatingAlert}</p>
            <p className="text-xs text-slate-400">Assessment is being terminated and auto-submitted with disqualification flag.</p>
          </div>
        </div>
      )}

      {/* Top Bar: Progress, Timer, Fullscreen Status */}
      <div className="glass-panel rounded-2xl p-4 mb-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        
        {/* Candidate Info */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">{student.name}</h3>
            <p className="text-xs text-slate-400">{student.rollNumber} • {student.college}</p>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="w-full md:w-1/3 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Progress: {answeredCount} / {totalQuestions} Answered</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer & Fullscreen Fix & Palette */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {!isFullscreenActive && (
            <button
              onClick={reEnterFullscreen}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fix Fullscreen</span>
            </button>
          )}

          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold shadow-md ${
            timeLeft < 60 ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' : 'bg-slate-800 text-amber-300 border-slate-700'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowPalette(!showPalette)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Question Palette Grid"
          >
            <Grid className="w-5 h-5 text-indigo-400" />
          </button>

        </div>

      </div>

      {/* Main Question Card Area with Anti-OCR Candidate Watermark */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 flex-1 flex flex-col justify-between mb-6 relative overflow-hidden">
        
        {/* Security Candidate Tiled Watermark Background (Anti-OCR & Google Lens) */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] flex flex-wrap items-center justify-center p-4 gap-12 font-mono text-[11px] uppercase font-black text-indigo-300 rotate-[-12deg] z-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i}>
              PROCTORING PROTECTED • ROLL: {student.rollNumber} • CANDIDATE: {student.name} • ADITYA UNIVERSITY
            </span>
          ))}
        </div>

        {/* Window Focus Blur Overlay if Mouse / Window Loses Focus */}
        {!isWindowFocused && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-3">
            <EyeOff className="w-12 h-12 text-amber-400 animate-pulse" />
            <h3 className="text-xl font-bold text-white">Window Focus Lost!</h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Please click back inside the assessment window to continue. Navigating away will trigger disqualification.
            </p>
          </div>
        )}

        {/* Question Content (z-10 relative) */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                {currentQuestion.topic}
              </span>
            </div>

            <button
              onClick={toggleFlag}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                flagged[currentQuestion.id]
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${flagged[currentQuestion.id] ? 'fill-amber-400' : ''}`} />
              <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>

          {/* Question Text (Anti-OCR text shadow protection) */}
          <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug mb-8 tracking-wide drop-shadow-sm">
            {currentQuestion.text}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestion.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = userAnswers[currentQuestion.id] === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center space-x-4 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30 text-white font-medium shadow-md shadow-indigo-500/10'
                      : 'glass-card border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {letter}
                  </div>
                  <span className="text-sm sm:text-base flex-1">{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 relative z-10">
          
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Question Palette Sidebar Drawer */}
      {showPalette && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm glass-panel h-full p-6 border-l border-slate-800 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg flex items-center space-x-2">
                <Grid className="w-5 h-5 text-indigo-400" />
                <span>Question Palette</span>
              </h3>
              <button
                onClick={() => setShowPalette(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const isFlagged = flagged[q.id];

                let bgClass = "bg-slate-800 text-slate-400 border-slate-700";
                if (isCurrent) bgClass = "ring-2 ring-indigo-400 bg-indigo-600 text-white font-bold";
                else if (isAnswered) bgClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
                else if (isFlagged) bgClass = "bg-amber-500/20 text-amber-400 border-amber-500/40";

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPalette(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
                <span className="text-slate-300">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
                <span className="text-slate-300">Flagged for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
                <span className="text-slate-400">Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Send className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Submit Your Assessment?</h3>
              <p className="text-xs text-slate-400 mt-1">
                You have answered <span className="text-emerald-400 font-bold">{answeredCount}</span> out of <span className="text-white font-bold">{totalQuestions}</span> questions.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                Return to Exam
              </button>
              <button
                onClick={() => submitQuiz(false, "")}
                className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
