import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Trophy, 
  Settings, 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Download, 
  Search, 
  Check, 
  X, 
  Save, 
  Layers,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = ({ 
  questions, 
  leaderboard, 
  settings, 
  onSaveQuestions, 
  onResetQuestions, 
  onSaveSettings, 
  onDeleteLeaderboardEntry,
  onClearLeaderboard,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('QUESTIONS'); // QUESTIONS, LEADERBOARD, SETTINGS, ANALYTICS
  
  // Question Filter
  const [questionSearch, setQuestionSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');

  // Question Modal state (Add / Edit)
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qDifficulty, setQDifficulty] = useState('EASY');
  const [qTopic, setQTopic] = useState('');
  const [qExplanation, setQExplanation] = useState('');

  // Settings state
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(questionSearch.toLowerCase()) || 
                          q.topic.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect(0);
    setQDifficulty('EASY');
    setQTopic('General OOP');
    setQExplanation('');
    setShowQuestionModal(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQText(q.text);
    setQOptions([...q.options]);
    setQCorrect(q.correctOptionIndex);
    setQDifficulty(q.difficulty);
    setQTopic(q.topic);
    setQExplanation(q.explanation || '');
    setShowQuestionModal(true);
  };

  const handleSaveQuestionForm = (e) => {
    e.preventDefault();
    if (!qText.trim() || qOptions.some(o => !o.trim())) {
      alert("Please fill in question text and all 4 options.");
      return;
    }

    if (editingQuestion) {
      // Edit
      const updated = questions.map(q => q.id === editingQuestion.id ? {
        ...q,
        text: qText.trim(),
        options: qOptions.map(o => o.trim()),
        correctOptionIndex: parseInt(qCorrect),
        difficulty: qDifficulty,
        topic: qTopic.trim(),
        explanation: qExplanation.trim()
      } : q);
      onSaveQuestions(updated);
    } else {
      // Add new
      const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      const newQ = {
        id: nextId,
        text: qText.trim(),
        options: qOptions.map(o => o.trim()),
        correctOptionIndex: parseInt(qCorrect),
        difficulty: qDifficulty,
        topic: qTopic.trim(),
        explanation: qExplanation.trim()
      };
      onSaveQuestions([newQ, ...questions]);
    }
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updated = questions.filter(q => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  const handleSaveSettingsForm = (e) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2500);
  };

  const exportLeaderboardCSV = () => {
    if (leaderboard.length === 0) {
      alert("No leaderboard data to export.");
      return;
    }
    const headers = ["Candidate Name", "Roll Number", "College", "Difficulty", "Score", "Max Score", "Percentage", "Time Taken (s)", "Cheating Flag", "Date"];
    const rows = leaderboard.map(r => [
      `"${r.student.name}"`,
      `"${r.student.rollNumber}"`,
      `"${r.student.college}"`,
      `"${r.student.difficulty}"`,
      r.score,
      r.maxScore,
      Math.round(r.percentage) + '%',
      r.timeTakenSec,
      r.cheatingDetected ? 'YES' : 'NO',
      `"${r.timestamp}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quizmaster_leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics Math
  const totalAttempts = leaderboard.length;
  const passedAttempts = leaderboard.filter(r => !r.cheatingDetected && r.percentage >= 60).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  const avgScore = totalAttempts > 0 ? Math.round(leaderboard.reduce((acc, r) => acc + r.percentage, 0) / totalAttempts) : 0;
  const cheatingCount = leaderboard.filter(r => r.cheatingDetected).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-6xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>Administrator Control Center</span>
              </h2>
              <p className="text-xs text-slate-400">Manage Question Bank, Leaderboards, Settings & Analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition-all self-end sm:self-auto"
          >
            <X className="w-4 h-4" />
            <span>Close Admin Panel</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 py-3 overflow-x-auto">
          {[
            { id: 'QUESTIONS', label: 'Question Bank', icon: HelpCircle, count: questions.length },
            { id: 'LEADERBOARD', label: 'Leaderboard Records', icon: Trophy, count: leaderboard.length },
            { id: 'SETTINGS', label: 'Quiz Settings', icon: Settings },
            { id: 'ANALYTICS', label: 'Analytics Dashboard', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-700 text-slate-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto py-6">
          
          {/* TAB 1: QUESTION BANK CRUD */}
          {activeTab === 'QUESTIONS' && (
            <div className="space-y-6">
              
              {/* Question Action Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      placeholder="Search questions or topic..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={onResetQuestions}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleOpenAddQuestion}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New MCQ</span>
                  </button>
                </div>

              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No questions match your filter.</p>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-400">#{q.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            q.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {q.topic}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">{q.text}</p>
                        <p className="text-xs text-slate-400">
                          Correct Choice: <strong className="text-emerald-400">[{String.fromCharCode(65 + q.correctOptionIndex)}] {q.options[q.correctOptionIndex]}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditQuestion(q)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all"
                          title="Edit Question"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: LEADERBOARD MANAGER */}
          {activeTab === 'LEADERBOARD' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Total Recorded Attempts: <strong className="text-white">{leaderboard.length}</strong>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportLeaderboardCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export to CSV</span>
                  </button>

                  <button
                    onClick={onClearLeaderboard}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Entries</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">Leaderboard is empty.</p>
                  </div>
                ) : (
                  leaderboard.map((rec) => (
                    <div
                      key={rec.id}
                      className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{rec.student.name}</span>
                          <span className="text-xs text-indigo-400 font-semibold">({rec.student.rollNumber})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {rec.student.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Score: <strong className="text-white">{rec.score}/{rec.maxScore} ({Math.round(rec.percentage)}%)</strong> • Time: {Math.round(rec.timeTakenSec)}s • Date: {rec.timestamp}
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteLeaderboardEntry(rec.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: QUIZ CONFIGURATION SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <form onSubmit={handleSaveSettingsForm} className="max-w-2xl mx-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Questions Per Round</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={localSettings.questionsPerRound}
                    onChange={(e) => setLocalSettings({ ...localSettings, questionsPerRound: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Time Per Question (Seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={localSettings.timePerQuestionSec}
                    onChange={(e) => setLocalSettings({ ...localSettings, timePerQuestionSec: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Marks Per Correct Answer</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={localSettings.marksPerQuestion}
                    onChange={(e) => setLocalSettings({ ...localSettings, marksPerQuestion: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Negative Mark Penalty</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={localSettings.negativeMarks}
                    onChange={(e) => setLocalSettings({ ...localSettings, negativeMarks: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.allowNegativeMarking}
                    onChange={(e) => setLocalSettings({ ...localSettings, allowNegativeMarking: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-200">Enable Negative Marking Penalty</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.strictAntiCheat}
                    onChange={(e) => setLocalSettings({ ...localSettings, strictAntiCheat: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-semibold text-slate-200">Enable Strict Anti-Cheating Protection (Auto-disqualify on tab switch)</span>
                </label>
              </div>

              {settingsSavedMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
                  ✓ Quiz Parameters Updated Successfully!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Quiz Configuration</span>
              </button>

            </form>
          )}

          {/* TAB 4: ANALYTICS DASHBOARD */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="glass-card p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Total Question Bank</span>
                  <span className="text-2xl font-black text-white">{questions.length}</span>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Total Student Candidates</span>
                  <span className="text-2xl font-black text-indigo-400">{totalAttempts}</span>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Overall Pass Rate</span>
                  <span className="text-2xl font-black text-emerald-400">{passRate}%</span>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Cheating Violations Flagged</span>
                  <span className="text-2xl font-black text-rose-400">{cheatingCount}</span>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowQuestionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-white">
              {editingQuestion ? 'Edit Question Details' : 'Create New MCQ Question'}
            </h3>

            <form onSubmit={handleSaveQuestionForm} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Question Text *</label>
                <textarea
                  rows="3"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter MCQ Question problem statement..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Difficulty Level</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Topic Category</label>
                  <input
                    type="text"
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    placeholder="e.g. Polymorphism"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">Options A, B, C, D *</label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter} className="flex items-center space-x-3">
                    <span className="w-7 text-xs font-extrabold text-indigo-400">[{letter}]</span>
                    <input
                      type="text"
                      value={qOptions[idx]}
                      onChange={(e) => {
                        const copy = [...qOptions];
                        copy[idx] = e.target.value;
                        setQOptions(copy);
                      }}
                      placeholder={`Option ${letter} choice...`}
                      className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Correct Option</label>
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-slate-900"
                >
                  <option value={0}>Option [A]</option>
                  <option value={1}>Option [B]</option>
                  <option value={2}>Option [C]</option>
                  <option value={3}>Option [D]</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Explanation for Solution</label>
                <textarea
                  rows="2"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Detailed reasoning why this option is correct..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Question
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
