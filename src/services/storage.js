import { INITIAL_QUESTIONS, DEFAULT_QUIZ_SETTINGS } from '../data/initialQuestions';

const KEYS = {
  QUESTIONS: 'quizmaster_questions_v2',
  LEADERBOARD: 'quizmaster_leaderboard_v2',
  SETTINGS: 'quizmaster_settings_v2',
  ADMIN_SESSION: 'quizmaster_admin_session_v2'
};

export const StorageService = {
  // Questions Management
  getQuestions: () => {
    try {
      const data = localStorage.getItem(KEYS.QUESTIONS);
      if (!data) {
        localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
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

      // If stored array has fewer questions than initial set, merge missing initial questions
      if (migrated.length < INITIAL_QUESTIONS.length) {
        const existingIds = new Set(migrated.map(q => q.id));
        const missing = INITIAL_QUESTIONS.filter(q => !existingIds.has(q.id));
        const combined = [...migrated, ...missing];
        localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(combined));
        return combined;
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
        timestamp: new Date().toLocaleString()
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
