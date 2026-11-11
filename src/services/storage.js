import { INITIAL_QUESTIONS, DEFAULT_QUIZ_SETTINGS } from '../data/initialQuestions';

const KEYS = {
  QUESTIONS: 'quizmaster_questions_v2',
  QUESTIONS_MIGRATED_C: 'quizmaster_migrated_c_v3',
  LEADERBOARD: 'quizmaster_leaderboard_v2',
  SETTINGS: 'quizmaster_settings_v2',
  ADMIN_SESSION: 'quizmaster_admin_session_v2',
  CUSTOM_QUIZZES: 'quizmaster_custom_quizzes_v2'
};

const DEFAULT_CUSTOM_QUIZZES = [
  {
    id: 'AU-OOP-2026',
    title: 'Aditya University - CSE Object-Oriented C++ Mid-Term Assessment',
    description: 'Official department assessment covering encapsulation, dynamic polymorphism, virtual tables, and memory management.',
    language: 'CPP',
    difficulty: 'MIXED',
    durationMinutes: 10,
    passingPercentage: 60,
    enableWebcamProctor: true,
    strictAntiCheat: true,
    marksPerQuestion: 4,
    negativeMarks: 1,
    questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    createdAt: new Date().toLocaleDateString(),
    status: 'ACTIVE'
  },
  {
    id: 'AU-C-PROG',
    title: 'Aditya University - C Programming & Pointers Mastery Exam',
    description: 'Core assessment evaluating pointers, dynamic memory allocation (malloc/calloc), structs, unions, and C memory architecture.',
    language: 'C',
    difficulty: 'MEDIUM',
    durationMinutes: 12,
    passingPercentage: 60,
    enableWebcamProctor: true,
    strictAntiCheat: true,
    marksPerQuestion: 4,
    negativeMarks: 1,
    questionIds: [91, 92, 93, 94, 95, 101, 102, 104, 111, 112],
    createdAt: new Date().toLocaleDateString(),
    status: 'ACTIVE'
  },
  {
    id: 'AU-JAVA-CORE',
    title: 'Aditya University - Java Enterprise Architecture Examination',
    description: 'Evaluation of JVM memory structures, multithreading synchronizers, OOP inheritance, and collections.',
    language: 'JAVA',
    difficulty: 'MIXED',
    durationMinutes: 12,
    passingPercentage: 65,
    enableWebcamProctor: true,
    strictAntiCheat: true,
    marksPerQuestion: 4,
    negativeMarks: 1,
    questionIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    createdAt: new Date().toLocaleDateString(),
    status: 'ACTIVE'
  }
];

export const StorageService = {
  // Questions Management
  getQuestions: () => {
    try {
      const data = localStorage.getItem(KEYS.QUESTIONS);
      if (!data) {
        localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
        localStorage.setItem(KEYS.QUESTIONS_MIGRATED_C, 'true');
        return INITIAL_QUESTIONS;
      }
      const parsed = JSON.parse(data);
      // Migrate old data missing 'language' tag
      let needsMigration = false;
      const migrated = parsed.map(q => {
        if (!q.language) {
          needsMigration = true;
          return { ...q, language: 'CPP' };
        }
        return q;
      });

      // One-time merge for newly added C Programming questions (v3) or missing defaults
      const hasMigratedC = localStorage.getItem(KEYS.QUESTIONS_MIGRATED_C) === 'true';
      if (!hasMigratedC || migrated.length < INITIAL_QUESTIONS.length) {
        const existingIds = new Set(migrated.map(q => q.id));
        const missing = INITIAL_QUESTIONS.filter(q => !existingIds.has(q.id));
        localStorage.setItem(KEYS.QUESTIONS_MIGRATED_C, 'true');
        if (missing.length > 0) {
          const combined = [...migrated, ...missing];
          localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(combined));
          return combined;
        }
      }

      if (needsMigration) {
        localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(migrated));
      }
      return migrated;
    } catch (e) {
      console.error("Failed to load questions", e);
      return INITIAL_QUESTIONS;
    }
  },

  saveQuestions: (questions) => {
    try {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error("Failed to save questions", e);
    }
  },

  resetQuestionsToDefault: () => {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  },

  addQuestion: (newQ) => {
    const questions = StorageService.getQuestions();
    const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const formattedQuestion = { ...newQ, id: nextId, language: newQ.language || 'CPP' };
    const updated = [formattedQuestion, ...questions];
    StorageService.saveQuestions(updated);
    return updated;
  },

  updateQuestion: (updatedQ) => {
    const questions = StorageService.getQuestions();
    const updated = questions.map(q => q.id === updatedQ.id ? updatedQ : q);
    StorageService.saveQuestions(updated);
    return updated;
  },

  deleteQuestion: (id) => {
    const questions = StorageService.getQuestions();
    const updated = questions.filter(q => q.id !== id);
    StorageService.saveQuestions(updated);
    return updated;
  },

  // Custom Quizzes / Assignments Management
  getCustomQuizzes: () => {
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_QUIZZES);
      if (!data) {
        localStorage.setItem(KEYS.CUSTOM_QUIZZES, JSON.stringify(DEFAULT_CUSTOM_QUIZZES));
        return DEFAULT_CUSTOM_QUIZZES;
      }
      let parsed = JSON.parse(data);
      let updated = false;

      // Fix legacy AU-JAVA-CORE questionIds if needed
      parsed = parsed.map(q => {
        if (q.id === 'AU-JAVA-CORE' && q.questionIds && q.questionIds[0] === 101) {
          updated = true;
          return { ...q, questionIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], difficulty: 'MIXED' };
        }
        return q;
      });

      // Add AU-C-PROG preset once if missing
      if (!localStorage.getItem('quizmaster_added_c_quiz_v3') && !parsed.some(q => q.id === 'AU-C-PROG')) {
        const cPreset = DEFAULT_CUSTOM_QUIZZES.find(q => q.id === 'AU-C-PROG');
        if (cPreset) {
          parsed = [cPreset, ...parsed];
          updated = true;
        }
        localStorage.setItem('quizmaster_added_c_quiz_v3', 'true');
      }

      if (updated) {
        localStorage.setItem(KEYS.CUSTOM_QUIZZES, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error("Failed to load custom quizzes", e);
      return DEFAULT_CUSTOM_QUIZZES;
    }
  },

  saveCustomQuizzes: (quizzes) => {
    try {
      localStorage.setItem(KEYS.CUSTOM_QUIZZES, JSON.stringify(quizzes));
    } catch (e) {
      console.error("Failed to save custom quizzes", e);
    }
  },

  addCustomQuiz: (newQuiz) => {
    const quizzes = StorageService.getCustomQuizzes();
    const id = newQuiz.id || `AU-QUIZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullQuiz = {
      ...newQuiz,
      id: id.toUpperCase(),
      createdAt: new Date().toLocaleDateString(),
      status: newQuiz.status || 'ACTIVE'
    };
    const updated = [fullQuiz, ...quizzes];
    StorageService.saveCustomQuizzes(updated);
    return updated;
  },

  updateCustomQuiz: (updatedQuiz) => {
    const quizzes = StorageService.getCustomQuizzes();
    const updated = quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q);
    StorageService.saveCustomQuizzes(updated);
    return updated;
  },

  deleteCustomQuiz: (id) => {
    const quizzes = StorageService.getCustomQuizzes();
    const updated = quizzes.filter(q => q.id !== id);
    StorageService.saveCustomQuizzes(updated);
    return updated;
  },

  getCustomQuizById: (id) => {
    if (!id) return null;
    const quizzes = StorageService.getCustomQuizzes();
    const normalized = id.trim().toUpperCase();
    return quizzes.find(q => q.id.toUpperCase() === normalized) || null;
  },

  // Leaderboard Management
  getLeaderboard: () => {
    try {
      const data = localStorage.getItem(KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load leaderboard", e);
      return [];
    }
  },

  saveQuizRecord: (record) => {
    try {
      const leaderboard = StorageService.getLeaderboard();
      const newRecord = {
        ...record,
        id: 'REC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toLocaleString(),
        quizId: record.quizId || null,
        quizTitle: record.quizTitle || null,
        certSignature: record.certSignature || null
      };
      const updated = [newRecord, ...leaderboard];
      localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Failed to save leaderboard record", e);
      return [];
    }
  },

  deleteLeaderboardEntry: (id) => {
    const leaderboard = StorageService.getLeaderboard();
    const updated = leaderboard.filter(r => r.id !== id);
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(updated));
    return updated;
  },

  clearLeaderboard: () => {
    localStorage.removeItem(KEYS.LEADERBOARD);
    return [];
  },

  // Quiz Settings Management
  getSettings: () => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_QUIZ_SETTINGS, ...JSON.parse(data) } : DEFAULT_QUIZ_SETTINGS;
    } catch (e) {
      return DEFAULT_QUIZ_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  },

  // Admin Session
  isAdminLoggedIn: () => {
    return sessionStorage.getItem(KEYS.ADMIN_SESSION) === 'true';
  },

  setAdminLoggedIn: (status) => {
    if (status) {
      sessionStorage.setItem(KEYS.ADMIN_SESSION, 'true');
    } else {
      sessionStorage.removeItem(KEYS.ADMIN_SESSION);
    }
  }
};
