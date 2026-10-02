import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { StudentRegistration } from './components/StudentRegistration';
import { InstructionsModal } from './components/InstructionsModal';
import { QuizRunner } from './components/QuizRunner';
import { QuizResults } from './components/QuizResults';
import { CertificateModal } from './components/CertificateModal';
import { VerificationModal } from './components/VerificationModal';
import { Leaderboard } from './components/Leaderboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const [currentStep, setCurrentStep] = useState('REGISTRATION'); // REGISTRATION, INSTRUCTIONS, QUIZ, RESULTS
  const [student, setStudent] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // Storage Data States
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCertId, setVerificationCertId] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Load initial data
  useEffect(() => {
    const qData = StorageService.getQuestions();
    const sData = StorageService.getSettings();
    const lData = StorageService.getLeaderboard();
    const adminState = StorageService.isAdminLoggedIn();

    setQuestions(qData);
    setSettings(sData);
    setLeaderboard(lData);
    setIsAdminLoggedIn(adminState);
  }, []);

  // Step 1: Student Registration
  const handleRegisterStudent = (studentDetails) => {
    setStudent(studentDetails);

    // Filter questions by language & level
    const allQuestions = StorageService.getQuestions();
    
    // 1. Language Filter
    let langFiltered = allQuestions.filter(q => (q.language || 'CPP') === (studentDetails.language || 'CPP'));
    if (langFiltered.length === 0) {
      langFiltered = allQuestions; // Fallback
    }

    // 2. Difficulty Filter
    let levelFiltered = langFiltered;
    if (studentDetails.difficulty !== 'MIXED') {
      levelFiltered = langFiltered.filter(q => q.difficulty === studentDetails.difficulty);
      if (levelFiltered.length === 0) {
        levelFiltered = langFiltered; // Fallback
      }
    }

    // Shuffle and pick requested round size
    const shuffled = [...levelFiltered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(shuffled.length, settings.questionsPerRound || 10));

    setActiveQuestions(selected);
    setCurrentStep('INSTRUCTIONS');
  };

  // Step 2: Start Quiz
  const handleStartQuiz = () => {
    setCurrentStep('QUIZ');
  };

  // Step 3: Finish Quiz & Record Result
  const handleFinishQuiz = (resultData) => {
    setQuizResult(resultData);
    
    // Save to Leaderboard
    const updatedLeaderboard = StorageService.saveQuizRecord({
      student: resultData.student,
      score: resultData.score,
      maxScore: resultData.maxScore,
      percentage: resultData.percentage,
      timeTakenSec: resultData.timeTakenSec,
      cheatingDetected: resultData.cheatingDetected,
      disqualificationReason: resultData.disqualificationReason
    });

    setLeaderboard(updatedLeaderboard);
    setCurrentStep('RESULTS');
  };

  // Open Verification Modal
  const handleOpenVerification = (certId = '') => {
    setVerificationCertId(certId);
    setShowVerificationModal(true);
  };

  // Admin Actions
  const handleAdminLoginSuccess = () => {
    StorageService.setAdminLoggedIn(true);
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    StorageService.setAdminLoggedIn(false);
    setIsAdminLoggedIn(false);
    setShowAdminDashboard(false);
  };

  const handleSaveQuestions = (updatedQuestions) => {
    StorageService.saveQuestions(updatedQuestions);
    setQuestions(updatedQuestions);
  };

  const handleResetQuestions = () => {
    const defaultQs = StorageService.resetQuestionsToDefault();
    setQuestions(defaultQs);
  };

  const handleSaveSettings = (updatedSettings) => {
    StorageService.saveSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const handleDeleteLeaderboardEntry = (id) => {
    const updated = StorageService.deleteLeaderboardEntry(id);
    setLeaderboard(updated);
  };

  const handleClearLeaderboard = () => {
    const updated = StorageService.clearLeaderboard();
    setLeaderboard(updated);
  };

  const handleResetApp = () => {
    setStudent(null);
    setActiveQuestions([]);
    setQuizResult(null);
    setCurrentStep('REGISTRATION');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden bg-ambient-grid bg-dot-pattern">
      
      {/* Dynamic Floating Ambient Glow Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }} />
      <div className="fixed top-[35%] right-[15%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[110px] pointer-events-none animate-float" style={{ animationDelay: '-1.5s' }} />

      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenAdmin={() => isAdminLoggedIn ? setShowAdminDashboard(true) : setShowAdminLogin(true)}
        onOpenVerification={() => handleOpenVerification('')}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
        onResetQuiz={handleResetApp}
        activeStudent={student}
      />

      {/* Assessment Workflow Stepper Bar */}
      <div className="w-full border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-semibold">
          {[
            { key: 'REGISTRATION', label: '1. Registration', num: 1 },
            { key: 'INSTRUCTIONS', label: '2. Guidelines', num: 2 },
            { key: 'QUIZ', label: '3. Assessment', num: 3 },
            { key: 'RESULTS', label: '4. Results', num: 4 }
          ].map((step, idx) => {
            const stepOrder = { 'REGISTRATION': 1, 'INSTRUCTIONS': 2, 'QUIZ': 3, 'RESULTS': 4 };
            const currentNum = stepOrder[currentStep] || 1;
            const isPassed = currentNum > step.num;
            const isCurrent = currentStep === step.key;

            return (
              <React.Fragment key={step.key}>
                {idx > 0 && (
                  <div className={`flex-1 h-[2px] mx-2 sm:mx-4 rounded transition-all duration-500 ${
                    isPassed ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-800'
                  }`} />
                )}
                <div className={`flex items-center space-x-2 transition-all duration-300 ${
                  isCurrent 
                    ? 'text-indigo-400 font-extrabold scale-105' 
                    : isPassed 
                      ? 'text-emerald-400 font-bold' 
                      : 'text-slate-500 font-medium'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border transition-all ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-500/20' 
                      : isPassed 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}>
                    {isPassed ? '✓' : step.num}
                  </div>
                  <span className="hidden sm:inline tracking-tight">{step.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 relative z-10 animate-slide-up">
        {currentStep === 'REGISTRATION' && (
          <StudentRegistration
            onRegisterStudent={handleRegisterStudent}
            availableQuestionsCount={questions.length}
          />
        )}

        {currentStep === 'INSTRUCTIONS' && student && (
          <InstructionsModal
            student={student}
            settings={settings}
            questionCount={activeQuestions.length}
            onStartQuiz={handleStartQuiz}
            onBack={() => setCurrentStep('REGISTRATION')}
          />
        )}

        {currentStep === 'QUIZ' && student && (
          <QuizRunner
            student={student}
            questions={activeQuestions}
            settings={settings}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {currentStep === 'RESULTS' && quizResult && (
          <QuizResults
            result={quizResult}
            onOpenCertificate={() => setShowCertificate(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onRetake={handleResetApp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 mt-auto relative z-10">
        <p>© {new Date().getFullYear()} QuizMaster Pro • Advanced Proctored Examination System • CSE Dept</p>
      </footer>

      {/* Global Modals */}
      {showLeaderboard && (
        <Leaderboard
          leaderboard={leaderboard}
          onClose={() => setShowLeaderboard(false)}
          isAdmin={isAdminLoggedIn}
          onDeleteEntry={handleDeleteLeaderboardEntry}
          onClearLeaderboard={handleClearLeaderboard}
        />
      )}

      {showCertificate && (
        <CertificateModal
          result={quizResult}
          settings={settings}
          onClose={() => setShowCertificate(false)}
          onOpenVerification={handleOpenVerification}
        />
      )}

      <VerificationModal
        isOpen={showVerificationModal}
        initialCertId={verificationCertId}
        onClose={() => setShowVerificationModal(false)}
      />

      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {showAdminDashboard && (
        <AdminDashboard
          questions={questions}
          leaderboard={leaderboard}
          settings={settings}
          onSaveQuestions={handleSaveQuestions}
          onResetQuestions={handleResetQuestions}
          onSaveSettings={handleSaveSettings}
          onDeleteLeaderboardEntry={handleDeleteLeaderboardEntry}
          onClearLeaderboard={handleClearLeaderboard}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}

    </div>
  );
}
