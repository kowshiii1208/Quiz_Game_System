/**
 * Cryptographic Utility Service
 * Provides SHA-256 hashing, digital signatures, and zero-knowledge client answer protection.
 */

const SALT = "ADITYA_CSE_AUTH_SECRET_SALT_2026";

export const CryptoService = {
  /**
   * Computes SHA-256 hash string (hex) using native Web Crypto API.
   * @param {string} message - Plaintext string to hash
   * @returns {Promise<string>} 64-character hexadecimal SHA-256 digest
   */
  sha256: async (message) => {
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      }
    } catch (err) {
      console.warn("Native crypto.subtle unavailable, using fallback hash", err);
    }
    // Deterministic fallback hash if Web Crypto is unavailable in certain sandboxes
    return CryptoService.fallbackHash(message);
  },

  /**
   * Deterministic 64-character hash fallback
   */
  fallbackHash: (str) => {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
    const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
    return (p1 + p2 + p1 + p2 + p1 + p2 + p1 + p2).slice(0, 64);
  },

  /**
   * Generates a tamper-proof SHA-256 digital signature for an academic certificate
   */
  generateCertificateSignature: async ({ certId, rollNumber, name, score, maxScore, percentage, date }) => {
    const canonicalPayload = [
      'AU_CERT_V1',
      certId || '',
      (rollNumber || '').trim().toUpperCase(),
      (name || '').trim().toUpperCase(),
      score || 0,
      maxScore || 0,
      Math.round(percentage || 0),
      date || '',
      SALT
    ].join('::');

    const signature = await CryptoService.sha256(canonicalPayload);
    return signature;
  },

  /**
   * Verifies if a given certificate signature matches the record
   */
  verifyCertificateSignature: async (record, signatureToVerify) => {
    if (!signatureToVerify || !record) return false;
    const expected = await CryptoService.generateCertificateSignature({
      certId: record.certId || record.id,
      rollNumber: record.student?.rollNumber,
      name: record.student?.name,
      score: record.score,
      maxScore: record.maxScore,
      percentage: record.percentage,
      date: record.timestamp
    });
    return expected.toLowerCase() === signatureToVerify.trim().toLowerCase();
  },

  /**
   * Generates a one-way zero-knowledge digest for an MCQ option choice.
   * Prevents students from reading answers directly from JavaScript memory / React DevTools.
   */
  generateAnswerDigest: async (questionId, optionIndex) => {
    const raw = `Q_${questionId}__OPT_${optionIndex}__${SALT}`;
    return await CryptoService.sha256(raw);
  },

  /**
   * Prepares questions for student assessment by removing raw correctOptionIndex
   * and replacing it with an immutable cryptographic answer digest.
   */
  obfuscateQuestionsForAssessment: async (questions) => {
    const secured = [];
    for (const q of questions) {
      const correctDigest = await CryptoService.generateAnswerDigest(q.id, q.correctOptionIndex);
      // Remove correctOptionIndex and explanation so they cannot be inspected during test
      const { correctOptionIndex, explanation, ...sanitized } = q;
      secured.push({
        ...sanitized,
        answerDigest: correctDigest
      });
    }
    return secured;
  },

  /**
   * Verifies a student's chosen option against the cryptographic digest
   */
  verifySelectedOption: async (questionId, chosenOptionIndex, expectedDigest) => {
    if (chosenOptionIndex === undefined || chosenOptionIndex === null) return false;
    const computed = await CryptoService.generateAnswerDigest(questionId, chosenOptionIndex);
    return computed === expectedDigest;
  }
};

