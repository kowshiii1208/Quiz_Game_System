import React, { useState } from 'react';
import { 
  User, 
  Hash, 
  Building2, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Check, 
  Info,
  QrCode,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';
import { StorageService } from '../services/storage';

export const StudentRegistration = ({ onRegisterStudent, availableQuestionsCount }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [college, setCollege] = useState('Aditya University');
  const [language, setLanguage] = useState('CPP'); // CPP, JAVA, PYTHON
  const [difficulty, setDifficulty] = useState('EASY');
  const [errors, setErrors] = useState({});
  const [quizCodeInput, setQuizCodeInput] = useState('');
  const [appliedQuiz, setAppliedQuiz] = useState(null);
  const [quizCodeNotice, setQuizCodeNotice] = useState('');

  // Check URL query param ?quizId=
  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qId = urlParams.get('quizId');
      if (qId) {
        const found = StorageService.getCustomQuizById(qId);
        if (found) {
          setAppliedQuiz(found);
          setLanguage(found.language || 'CPP');
        }
      }
    } catch (e) {}
  }, []);

  const handleApplyQuizCode = () => {
    if (!quizCodeInput.trim()) return;
    const found = StorageService.getCustomQuizById(quizCodeInput.trim());
    if (found) {
      setAppliedQuiz(found);
      setLanguage(found.language || 'CPP');
      setQuizCodeNotice(`Quiz "${found.title}" successfully loaded!`);
      setTimeout(() => setQuizCodeNotice(''), 3000);
    } else {
      alert(`No quiz found with code "${quizCodeInput.trim()}". Please check with your instructor.`);
    }
  };

  const collegePresets = [
    'Aditya University',
    'Aditya Engineering College (AEC)',
    'Aditya College of Engineering & Tech (ACET)',
    'Aditya College of Engineering (ACOE)'
  ];

  const languagesList = [
    {
      id: 'CPP',
      name: 'C++',
      subtitle: 'Object-Oriented & Systems Programming',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-600',
      badge: 'C++ 20 Standard',
      border: 'border-blue-500/50 bg-blue-950/20 text-blue-300'
    },
    {
      id: 'JAVA',
      name: 'Java',
      subtitle: 'Enterprise & JVM Architecture',
      icon: Code2,
      color: 'from-amber-500 to-orange-600',
      badge: 'Java 21 LTS',
      border: 'border-amber-500/50 bg-amber-950/20 text-amber-300'
    },
    {
      id: 'PYTHON',
      name: 'Python',
      subtitle: 'Data Science & Core Algorithms',
      icon: Terminal,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Python 3.12',
      border: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
    }
  ];

  const handleStart = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full Candidate Name is required';
    if (!rollNumber.trim()) newErrors.rollNumber = 'Roll Number / Registration ID is required';
    if (!college.trim()) newErrors.college = 'College / Institution name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegisterStudent({
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      college: college.trim(),
      language: appliedQuiz ? (appliedQuiz.language || 'CPP') : language,
      difficulty: appliedQuiz ? 'MIXED' : difficulty,
      quizId: appliedQuiz ? appliedQuiz.id : null,
      quizTitle: appliedQuiz ? appliedQuiz.title : null,
      customQuiz: appliedQuiz || null
    });
  };

  const difficultyLevels = [
    {
      id: 'EASY',
      title: 'Easy / Fundamentals',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      topics: ['Syntax & Basics', 'Classes & Objects', 'Constructors', 'Variables'],
      desc: 'Fundamental language principles, basic definitions, access modifiers, and object creation.'
    },
    {
      id: 'MEDIUM',
      title: 'Medium / Core Architecture',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20',
      icon: Flame,
      iconColor: 'text-amber-400',
      topics: ['Inheritance', 'Polymorphism', 'Overriding', 'Interfaces/Decorators'],
      desc: 'Dynamic binding, runtime polymorphism, exception handling, and structural abstractions.'
    },
    {
      id: 'HARD',
      title: 'Hard / Advanced Mastery',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/20',
      icon: Zap,
      iconColor: 'text-rose-400',
      topics: ['Memory Internals', 'Generics/GIL/RAII', 'Concurrency', 'Advanced Design'],
      desc: 'Deep runtime mechanics, memory management, concurrency models, and advanced language patterns.'
    },
    {
      id: 'MIXED',
      title: 'Mixed / Complete Assessment',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20',
      icon: Award,
      iconColor: 'text-indigo-400',
      topics: ['Full Language Spectrum', 'All Difficulty Levels', 'Merit Certificate Track'],
      desc: 'A comprehensive evaluation across all difficulty tiers.'
    }
  ];

  const getInitials = (str) => {
    if (!str.trim()) return 'AU';
    const parts = str.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const currentLangObj = languagesList.find(l => l.id === language);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Hero Header & University Branding */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>ADITYA UNIVERSITY • CSE EXAMINATION PORTAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Candidate Registration
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Select your evaluation programming language and difficulty level to proceed.
        </p>

        {/* Feature Highlights Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Cheat Enabled</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Merit Certificate</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Instant Verification</span>
          </div>
        </div>
      </div>

      {/* Main Registration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Candidate Information (7 Cols) */}
        <form onSubmit={handleStart} className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800/90 space-y-6">
          
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-indigo-400" />
              <span>1. Candidate Profile Information</span>
            </h2>
            <p className="text-xs text-slate-400">Information will be printed on your official certificate</p>
          </div>

          {/* Official Custom Assignment / QR Detected Banner */}
          {appliedQuiz ? (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 space-y-2 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OFFICIAL ASSIGNMENT CODE: {appliedQuiz.id}
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedQuiz(null)}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                >
                  Clear / Switch
                </button>
              </div>
              <h4 className="text-sm font-bold text-white">{appliedQuiz.title}</h4>
              <p className="text-xs text-slate-400">
                Duration: <strong className="text-slate-200">{appliedQuiz.durationMinutes || 15} Mins</strong> • 
                Pass Benchmark: <strong className="text-slate-200">{appliedQuiz.passingPercentage || 60}%</strong> • 
                Proctoring: <strong className="text-emerald-400">Enforced</strong>
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Have an Official Assignment Code / Scanned QR?</span>
                </span>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={quizCodeInput}
                  onChange={(e) => setQuizCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. AU-OOP-2026 or AU-JAVA-CORE"
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyQuizCode}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  Apply Code
                </button>
              </div>
              {quizCodeNotice && (
                <p className="text-[11px] text-emerald-400 font-medium">{quizCodeNotice}</p>
              )}
            </div>
          )}

          {/* Input: Candidate Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Full Name *</span>
              </span>
              {name.trim() && <span className="text-[11px] text-emerald-400 font-normal flex items-center"><Check className="w-3 h-3 mr-0.5" /> Validated</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kowshik Varma"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${errors.name ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
            />
            {errors.name && <p className="text-xs text-rose-400 font-medium">{errors.name}</p>}
          </div>

          {/* Input: Roll Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span>Roll Number / Registration ID *</span>
              </span>
              {rollNumber.trim() && <span className="text-[11px] text-emerald-400 font-normal flex items-center"><Check className="w-3 h-3 mr-0.5" /> Validated</span>}
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 21A91A0501"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-semibold uppercase tracking-wider ${errors.rollNumber ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
            />
            {errors.rollNumber && <p className="text-xs text-rose-400 font-medium">{errors.rollNumber}</p>}
          </div>

          {/* Input: College / Institution */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>College Name *</span>
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Aditya University"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm font-medium ${errors.college ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
            />
            {errors.college && <p className="text-xs text-rose-400 font-medium">{errors.college}</p>}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {collegePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCollege(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    college === preset 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Language Selection Track */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>2. Select Programming Language</span>
                </h3>
                <p className="text-xs text-slate-400">Choose test subject track</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {languagesList.map((lang) => {
                const Icon = lang.icon;
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? `${lang.border} ring-2 ring-indigo-500/40 shadow-lg scale-[1.02]`
                        : 'glass-card border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${lang.color} text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{lang.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{lang.badge}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Quiz Difficulty Selection */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>3. Difficulty Level</span>
                </h3>
                <p className="text-xs text-slate-400">Select difficulty tier</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                {availableQuestionsCount} Questions Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {difficultyLevels.map((lvl) => {
                const isSelected = difficulty === lvl.id;
                const IconComp = lvl.icon;

                return (
                  <div
                    key={lvl.id}
                    onClick={() => setDifficulty(lvl.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? lvl.activeBorder 
                        : 'glass-card border-slate-800/80 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border flex items-center space-x-1 ${lvl.badgeColor}`}>
                          <IconComp className={`w-3.5 h-3.5 ${lvl.iconColor}`} />
                          <span>{lvl.id}</span>
                        </span>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-normal mb-3">
                        {lvl.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 border-t border-slate-800/60 pt-2">
                      {lvl.topics.map((tp, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                          {tp}
                        </span>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Continue to Guidelines</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

        </form>

        {/* Right Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-slate-800/90 relative overflow-hidden space-y-6 holographic-card">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800/90 pb-4 relative z-10">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Candidate Pass</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                <span>ACTIVE</span>
              </span>
            </div>

            <div className="bg-slate-950/90 rounded-2xl p-5 border border-amber-500/40 relative overflow-hidden space-y-5 shadow-2xl z-10 backdrop-blur-md">
              
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/60" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/60" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/60" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/60" />

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 p-0.5 shadow-xl shrink-0 animate-glow-pulse">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl font-black text-white tracking-widest">
                    {getInitials(name)}
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-white truncate drop-shadow-sm">
                    {name.trim() || 'Candidate Name'}
                  </h3>
                  <p className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1">
                    <span>ROLL NO:</span>
                    <span className="text-indigo-300 font-mono">{rollNumber.trim() || '21A91A0501'}</span>
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {college.trim() || 'Aditya University'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Subject Track</span>
                  <span className="font-extrabold text-amber-400">{currentLangObj?.name}</span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Difficulty Level</span>
                  <span className="font-extrabold text-emerald-400">{difficulty}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900/60 font-medium">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Track: {currentLangObj?.subtitle}</span>
                </span>
                <span className="text-slate-500 font-mono">{new Date().toLocaleDateString()}</span>
              </div>

            </div>

            <div className="space-y-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/90 text-xs text-slate-300 backdrop-blur-md">
              <h4 className="font-extrabold text-white flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Guidelines Summary</span>
              </h4>

              <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tab switching is strictly monitored.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Correct answers carry +4 marks.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Score &ge; 60% earns a verified certificate with QR code.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
