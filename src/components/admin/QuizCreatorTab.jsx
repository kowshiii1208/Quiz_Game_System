import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  QrCode, 
  Share2, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Search, 
  X, 
  Copy, 
  ExternalLink,
  Code2,
  ShieldAlert,
  Calendar,
  Layers
} from 'lucide-react';
import QRCode from 'qrcode';
import { StorageService } from '../../services/storage';
import { ExcelExportService } from '../../services/excelExport';

export const QuizCreatorTab = ({ questions = [], leaderboard = [], onSaveQuestions }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  // Create Quiz Form States
  const [title, setTitle] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('CPP');
  const [difficulty, setDifficulty] = useState('MIXED');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(60);
  const [enableWebcamProctor, setEnableWebcamProctor] = useState(true);
  const [strictAntiCheat, setStrictAntiCheat] = useState(true);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Filter existing questions inside creator
  const [qSearch, setQSearch] = useState('');
  const [qFilterLang, setQFilterLang] = useState('ALL');

  // Custom question add inside creator modal
  const [showCustomQForm, setShowCustomQForm] = useState(false);
  const [customQText, setCustomQText] = useState('');
  const [customQOptions, setCustomQOptions] = useState(['', '', '', '']);
  const [customQCorrect, setCustomQCorrect] = useState(0);
  const [customQTopic, setCustomQTopic] = useState('Custom Topic');
  const [customQDiff, setCustomQDiff] = useState('MEDIUM');

  // Load quizzes on mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const list = StorageService.getCustomQuizzes();
    setQuizzes(list);
  };

  const handleOpenCreate = () => {
    setTitle('');
    setQuizCode(`AU-QUIZ-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
    setLanguage('CPP');
    setDifficulty('MIXED');
    setDurationMinutes(15);
    setPassingPercentage(60);
    setEnableWebcamProctor(true);
    setStrictAntiCheat(true);
    setSelectedQuestionIds([]);
    setShowCustomQForm(false);
    setShowCreateModal(true);
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a Quiz Title");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      alert("Please select at least one question for this quiz!");
      return;
    }

    const newQuiz = {
      id: quizCode.trim().toUpperCase() || `AU-QUIZ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      language,
      difficulty,
      durationMinutes: parseInt(durationMinutes) || 15,
      passingPercentage: parseInt(passingPercentage) || 60,
      enableWebcamProctor,
      strictAntiCheat,
      questionIds: selectedQuestionIds,
      status: 'ACTIVE'
    };

    StorageService.addCustomQuiz(newQuiz);
    loadQuizzes();
    setShowCreateModal(false);
    handleOpenShare(newQuiz);
  };

  const handleAddDirectCustomQuestion = (e) => {
    e.preventDefault();
    if (!customQText.trim() || customQOptions.some(o => !o.trim())) {
      alert("Please provide question text and all 4 options.");
      return;
    }

    const newQ = {
      text: customQText.trim(),
      options: customQOptions.map(o => o.trim()),
      correctOptionIndex: parseInt(customQCorrect),
      difficulty: customQDiff,
      language: language,
      topic: customQTopic.trim(),
      explanation: "Instructor specified custom question."
    };

    const updatedBank = StorageService.addQuestion(newQ);
    if (onSaveQuestions) {
      onSaveQuestions(updatedBank);
    }
    const addedId = updatedBank[0].id; // newest question has highest ID
    setSelectedQuestionIds(prev => [...prev, addedId]);

    // Reset mini form
    setCustomQText('');
    setCustomQOptions(['', '', '', '']);
    setCustomQCorrect(0);
    setShowCustomQForm(false);
  };

  const handleOpenShare = async (quiz) => {
    setSelectedQuiz(quiz);
    setCopySuccess(false);
    
    // Construct direct shareable URL with ?quizId=
    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname;
    const directUrl = `${currentOrigin}${currentPath}?quizId=${encodeURIComponent(quiz.id)}`;

    try {
      const url = await QRCode.toDataURL(directUrl, {
        margin: 2,
        width: 260,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error("QR Code Generation Error:", err);
    }

    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (!selectedQuiz) return;
    const directUrl = `${window.location.origin}${window.location.pathname}?quizId=${encodeURIComponent(selectedQuiz.id)}`;
    navigator.clipboard.writeText(directUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !selectedQuiz) return;
    const link = document.createElement('a');
    link.download = `Aditya_Quiz_QR_${selectedQuiz.id}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDeleteQuiz = (id) => {
    if (confirm("Are you sure you want to delete this custom quiz?")) {
      StorageService.deleteCustomQuiz(id);
      loadQuizzes();
    }
  };

  // Get candidates for a specific quiz
  const getCandidatesForQuiz = (quizId) => {
    return leaderboard.filter(r => r.quizId === quizId || r.quizTitle?.includes(quizId));
  };

  // Download Excel for specific quiz
  const handleExportQuizExcel = (quiz) => {
    const candidates = getCandidatesForQuiz(quiz.id);
    if (candidates.length === 0) {
      if (!confirm("No candidate attempts recorded yet for this quiz. Export blank template report?")) {
        return;
      }
    }
    ExcelExportService.exportQuizReportToExcel(quiz, candidates);
  };

  // Filtered available questions in creator modal
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(qSearch.toLowerCase()) || 
                          (q.topic && q.topic.toLowerCase().includes(qSearch.toLowerCase()));
    const matchesLang = qFilterLang === 'ALL' || q.language === qFilterLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <span>Official Quizzes & Examination Assignments</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Create targeted assessments, distribute instant QR codes/links to students, and download candidate Excel reports.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No custom quizzes created yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Create New Quiz" to generate an assessment with shareable QR codes.</p>
          </div>
        ) : (
          quizzes.map((quiz) => {
            const candidates = getCandidatesForQuiz(quiz.id);
            const isExpanded = expandedQuizId === quiz.id;

            return (
              <div 
                key={quiz.id}
                className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 transition-all"
              >
                {/* Main Row */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        {quiz.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                        {quiz.language || 'CPP'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {quiz.status || 'ACTIVE'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{quiz.durationMinutes || 15} Mins</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {quiz.title}
                    </h4>

                    {quiz.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{quiz.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Questions: <strong className="text-slate-200">{quiz.questionIds?.length || 10}</strong></span>
                      <span>Pass Mark: <strong className="text-slate-200">{quiz.passingPercentage || 60}%</strong></span>
                      <span>Created: <strong className="text-slate-200">{quiz.createdAt}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 w-full lg:w-auto flex-wrap gap-y-2">
                    
                    {/* Share / QR Code Button */}
                    <button
                      onClick={() => handleOpenShare(quiz)}
                      className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all"
                      title="Generate QR Code & Share Link"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Share / QR</span>
                    </button>

                    {/* Download Excel Report Button */}
                    <button
                      onClick={() => handleExportQuizExcel(quiz)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
                      title="Download Candidate Assessment Report in Excel format"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Download Excel ({candidates.length})</span>
                    </button>

                    {/* Toggle Candidates View */}
                    <button
                      onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-all"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Candidates ({candidates.length})</span>
                    </button>

                    {/* Delete Quiz */}
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* Expanded Candidate Submissions Table */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-3 animate-slide-up">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Candidate Submissions for {quiz.id} ({candidates.length} attempts)</span>
                      </span>

                      {candidates.length > 0 && (
                        <button
                          onClick={() => handleExportQuizExcel(quiz)}
                          className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Export to Excel (.xlsx)</span>
                        </button>
                      )}
                    </div>

                    {candidates.length === 0 ? (
                      <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
                        No candidates have submitted this quiz yet. Share the link or QR code with students!
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                            <tr>
                              <th className="py-2.5 px-3">Student Name</th>
                              <th className="py-2.5 px-3">Roll Number</th>
                              <th className="py-2.5 px-3">Score</th>
                              <th className="py-2.5 px-3">Percentage</th>
                              <th className="py-2.5 px-3">Time Taken</th>
                              <th className="py-2.5 px-3">Proctoring Status</th>
                              <th className="py-2.5 px-3">Submitted At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-medium">
                            {candidates.map((c, i) => {
                              const isPass = !c.cheatingDetected && (c.percentage >= (quiz.passingPercentage || 60));
                              return (
                                <tr key={c.id || i} className="hover:bg-slate-900/30">
                                  <td className="py-2 px-3 text-white font-semibold">{c.student?.name}</td>
                                  <td className="py-2 px-3 text-indigo-300 font-mono">{c.student?.rollNumber}</td>
                                  <td className="py-2 px-3 text-slate-300">{c.score} / {c.maxScore}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                      isPass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                      {Math.round(c.percentage)}%
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-slate-400">{c.timeTakenSec}s</td>
                                  <td className="py-2 px-3">
                                    {c.cheatingDetected ? (
                                      <span className="text-rose-400 flex items-center space-x-1 font-bold text-[11px]">
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                        <span>FLAGGED</span>
                                      </span>
                                    ) : (
                                      <span className="text-emerald-400 flex items-center space-x-1 font-semibold text-[11px]">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>CLEAN</span>
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-slate-500 text-[11px]">{c.timestamp}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* CREATE QUIZ MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-white">Create Official Custom Quiz</h3>
              <p className="text-xs text-slate-400 mt-1">Configure assessment rules, select questions, and generate a student QR code.</p>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Assessment Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Aditya University - C++ OOP Mid-Term 2026"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Quiz Code *</label>
                  <input
                    type="text"
                    value={quizCode}
                    onChange={(e) => setQuizCode(e.target.value)}
                    placeholder="e.g. AU-OOP-2026"
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono uppercase font-bold text-indigo-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Assessment Description / Instructions</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official instructions for candidates before starting the assessment..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              {/* Assessment Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="C">C Programming</option>
                    <option value="CPP">C++</option>
                    <option value="JAVA">Java</option>
                    <option value="PYTHON">Python</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Pass Mark (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={passingPercentage}
                    onChange={(e) => setPassingPercentage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-400">Webcam Proctor</label>
                  <select
                    value={enableWebcamProctor ? 'true' : 'false'}
                    onChange={(e) => setEnableWebcamProctor(e.target.value === 'true')}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="true">Active (Enforced)</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Question Selection Area */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-200">
                    Select Questions for this Quiz ({selectedQuestionIds.length} Selected) *
                  </label>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomQForm(prev => !prev)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showCustomQForm ? 'Hide Custom Question Form' : '+ Add Custom Question'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const allIds = filteredQuestions.map(q => q.id);
                        setSelectedQuestionIds(allIds);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Select All Filtered
                    </button>
                  </div>
                </div>

                {/* Optional Quick Add Custom Question Form */}
                {showCustomQForm && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 animate-slide-up">
                    <h5 className="text-xs font-bold text-indigo-300">Add Brand New Question to Quiz</h5>
                    <textarea
                      rows="2"
                      value={customQText}
                      onChange={(e) => setCustomQText(e.target.value)}
                      placeholder="Question statement..."
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {['A', 'B', 'C', 'D'].map((letter, idx) => (
                        <input
                          key={letter}
                          type="text"
                          value={customQOptions[idx]}
                          onChange={(e) => {
                            const copy = [...customQOptions];
                            copy[idx] = e.target.value;
                            setCustomQOptions(copy);
                          }}
                          placeholder={`Option [${letter}]`}
                          className="px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-400">Correct Option:</span>
                        <select
                          value={customQCorrect}
                          onChange={(e) => setCustomQCorrect(parseInt(e.target.value))}
                          className="px-2 py-1 rounded bg-slate-900 text-white text-xs"
                        >
                          <option value={0}>Option [A]</option>
                          <option value={1}>Option [B]</option>
                          <option value={2}>Option [C]</option>
                          <option value={3}>Option [D]</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDirectCustomQuestion}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                      >
                        Add to Quiz & Bank
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter and Search Questions */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={qSearch}
                      onChange={(e) => setQSearch(e.target.value)}
                      placeholder="Search question bank..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <select
                    value={qFilterLang}
                    onChange={(e) => setQFilterLang(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="ALL">All Tracks</option>
                    <option value="C">C Programming</option>
                    <option value="CPP">C++</option>
                    <option value="JAVA">Java</option>
                    <option value="PYTHON">Python</option>
                  </select>
                </div>

                {/* Question Picker Scrollable List */}
                <div className="max-h-60 overflow-y-auto space-y-2 rounded-2xl border border-slate-800 p-2 bg-slate-950/40">
                  {filteredQuestions.map(q => {
                    const isSelected = selectedQuestionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => {
                          setSelectedQuestionIds(prev => 
                            isSelected ? prev.filter(id => id !== q.id) : [...prev, q.id]
                          );
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                            : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent div
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-indigo-400 font-mono">#{q.id}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{q.language || 'CPP'}</span>
                            <span className="text-[10px] text-slate-400">{q.topic}</span>
                          </div>
                          <p className="line-clamp-2">{q.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save & Generate QR Code
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* SHARE & QR CODE MODAL */}
      {showShareModal && selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative text-center">
            
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-indigo-400 tracking-wider">
                QUIZ ACCESS CODE: {selectedQuiz.id}
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                {selectedQuiz.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Students can scan this QR code with their mobile phone camera or visit the link to start the exam immediately.
              </p>
            </div>

            {/* Rendered QR Code */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl mx-auto border-4 border-slate-800">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Assessment QR Code" className="w-48 h-48 mx-auto" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Direct Link Input with Copy Button */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${window.location.pathname}?quizId=${selectedQuiz.id}`}
                  className="flex-1 bg-transparent text-xs text-slate-300 font-mono focus:outline-none truncate px-1"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    copySuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleDownloadQr}
                  className="w-1/2 mr-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save QR Image</span>
                </button>

                <a
                  href={`?quizId=${selectedQuiz.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-1/2 ml-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Test Link</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

