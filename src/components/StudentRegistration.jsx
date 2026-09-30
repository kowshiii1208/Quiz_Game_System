import React, { useState } from 'react';
import { 
  User, 
  Hash, 
  Building2, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Award, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Check, 
  Info,
  QrCode
} from 'lucide-react';

export const StudentRegistration = ({ onRegisterStudent, availableQuestionsCount }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [college, setCollege] = useState('Aditya University');
  const [difficulty, setDifficulty] = useState('EASY');
  const [errors, setErrors] = useState({});

  const collegePresets = [
    'Aditya University',
    'Aditya Engineering College (AEC)',
    'Aditya College of Engineering & Tech (ACET)',
    'Aditya College of Engineering (ACOE)'
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
      difficulty
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
      target: 'Beginners & Syntax Practice',
      topics: ['Classes & Objects', 'Member Vars', 'Constructors', 'Basic Syntax'],
      desc: 'Fundamental OOP principles, basic class definitions, access modifiers, and object instantiation.'
    },
    {
      id: 'MEDIUM',
      title: 'Medium / Core Architecture',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-950/20',
      icon: Flame,
      iconColor: 'text-amber-400',
      target: 'Intermediate / Core Pillars',
      topics: ['Polymorphism', 'Virtual Methods', 'Inheritance', 'Operator Overloading'],
      desc: 'Dynamic binding, runtime polymorphism, copy constructors, operator overloading, and inheritance hierarchies.'
    },
    {
      id: 'HARD',
      title: 'Hard / Advanced C++',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/20',
      icon: Zap,
      iconColor: 'text-rose-400',
      target: 'Advanced / Systems Engineer',
      topics: ['Smart Pointers', 'Vtables', 'RAII Pattern', 'Exception Safety'],
      desc: 'Virtual destructors, diamond inheritance problem, RAII memory management, custom allocators, and vtable internals.'
    },
    {
      id: 'MIXED',
      title: 'Mixed / Complete Assessment',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20',
      icon: Award,
      iconColor: 'text-indigo-400',
      target: 'Comprehensive Evaluation',
      topics: ['Full OOP Spectrum', 'All Difficulty Levels', 'Merit Certificate Track'],
      desc: 'A comprehensive, random distribution across all difficulty tiers for complete evaluation.'
    }
  ];

  // Helper for live candidate initials
  const getInitials = (str) => {
    if (!str.trim()) return 'AU';
    const parts = str.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Hero Header & University Branding */}
      <div className="text-center space-y-3">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>ADITYA UNIVERSITY • CSE EXAMINATION PORTAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Candidate Registration
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Enter your details below to proceed to the examination guidelines.
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
            <span>Instant Results</span>
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
              <span>1. Profile Information</span>
            </h2>
            <p className="text-xs text-slate-400">Details will be printed on your certificate</p>
          </div>

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
                <span>Roll Number *</span>
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

            {/* Quick Preset Buttons */}
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

          {/* Step 2: Quiz Difficulty Selection */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>2. Difficulty Level</span>
                </h3>
                <p className="text-xs text-slate-400">Select difficulty track</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                {availableQuestionsCount} Questions
              </span>
            </div>

            {/* Level Cards Grid */}
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
                      {/* Header */}
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

                    {/* Topics Chips */}
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

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

        </form>

        {/* Right Preview: Live Candidate Exam Pass Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-slate-800/90 relative overflow-hidden space-y-6 holographic-card">
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
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

            {/* Candidate Card Visual */}
            <div className="bg-slate-950/90 rounded-2xl p-5 border border-amber-500/40 relative overflow-hidden space-y-5 shadow-2xl z-10 backdrop-blur-md">
              
              {/* Decorative Corner Lines */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/60" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/60" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/60" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/60" />

              {/* Avatar + Info */}
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

              {/* Assessment Meta Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Level</span>
                  <span className="font-extrabold text-amber-400">{difficulty}</span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Pass Mark</span>
                  <span className="font-extrabold text-emerald-400">&ge; 60%</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900/60 font-medium">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Subject: C++ & OOP</span>
                </span>
                <span className="text-slate-500 font-mono">{new Date().toLocaleDateString()}</span>
              </div>

            </div>

            {/* Quick Rules Checklist */}
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
                  <span>Score ≥ 60% earns a certificate.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
