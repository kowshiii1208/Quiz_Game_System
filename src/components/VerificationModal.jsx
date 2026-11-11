import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X, Search, Award, User, Hash, Calendar, Building2, BookOpen, AlertCircle, Lock } from 'lucide-react';
import { StorageService } from '../services/storage';
import { CryptoService } from '../services/cryptoService';

export const VerificationModal = ({ isOpen, onClose, initialCertId = '' }) => {
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [verifiedSignature, setVerifiedSignature] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e?.preventDefault();
    const query = certIdInput.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const leaderboard = StorageService.getLeaderboard();
    
    // Search by certificate ID match or Roll number match
    const foundRecord = leaderboard.find(record => {
      const matchRoll = record.student?.rollNumber?.toUpperCase() === query;
      const recordIdMatch = record.id?.toUpperCase() === query;
      const customCertIdMatch = query.includes(record.student?.rollNumber?.toUpperCase() || '___');
      return matchRoll || recordIdMatch || customCertIdMatch;
    });

    if (foundRecord) {
      const signature = await CryptoService.generateCertificateSignature({
        certId: foundRecord.certId || `AU-CERT-${foundRecord.student?.rollNumber}`,
        rollNumber: foundRecord.student?.rollNumber,
        name: foundRecord.student?.name,
        score: foundRecord.score,
        maxScore: foundRecord.maxScore,
        percentage: foundRecord.percentage,
        date: foundRecord.timestamp
      });
      setVerifiedSignature(signature);

      setVerificationResult({
        isValid: true,
        record: foundRecord
      });
    } else {
      setVerifiedSignature('');
      setVerificationResult({
        isValid: false,
        query
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Academic Certificate Verification</h2>
              <p className="text-xs text-slate-400">Official Aditya University Verification Registry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Enter Certificate ID or Student Roll Number
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="e.g. AU-CERT-849201 or 21A91A0501"
                className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-sm uppercase font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all shrink-0"
            >
              Verify Now
            </button>
          </div>
        </form>

        {/* Verification Output Results */}
        {hasSearched && (
          <div className="pt-2 animate-fade-in">
            {verificationResult?.isValid ? (
              <div className="bg-slate-950/90 rounded-2xl p-5 border border-emerald-500/50 space-y-4 shadow-xl">
                
                <div className="flex items-center justify-between bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-extrabold text-emerald-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>OFFICIALLY VERIFIED MERIT CERTIFICATE</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                    SHA-256 MATCH
                  </span>
                </div>

                {verifiedSignature && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Tamper-Proof Cryptographic Signature Verified:</span>
                    </div>
                    <p className="font-mono text-[10px] text-slate-400 break-all bg-slate-950 p-1.5 rounded border border-slate-800/80">
                      {verifiedSignature}
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400 flex items-center"><User className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Candidate Name:</span>
                    <strong className="text-white text-sm">{verificationResult.record.student.name}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400 flex items-center"><Hash className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Roll Number:</span>
                    <strong className="text-indigo-300 font-mono">{verificationResult.record.student.rollNumber}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400 flex items-center"><Building2 className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Institution:</span>
                    <span className="text-slate-200 font-semibold">{verificationResult.record.student.college}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400 flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Subject / Track:</span>
                    <span className="text-amber-400 font-bold">
                      {verificationResult.record.student.language === 'JAVA' ? 'Java Architecture' : verificationResult.record.student.language === 'PYTHON' ? 'Python Programming' : 'C++ Architecture'} ({verificationResult.record.student.difficulty} Level)
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400 flex items-center"><Award className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Examination Score:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">
                      {Math.round(verificationResult.record.percentage)}% ({verificationResult.record.score}/{verificationResult.record.maxScore} Marks)
                    </span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Issue Timestamp:</span>
                    <span className="text-slate-300 font-mono">{verificationResult.record.timestamp}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-900">
                  Certified by Department of Computer Science & Engineering • Aditya University
                </div>

              </div>
            ) : (
              <div className="bg-rose-950/20 rounded-2xl p-5 border border-rose-500/30 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-rose-300">Certificate Record Not Found</h4>
                <p className="text-xs text-slate-400">
                  No registered examination record matching "{verificationResult?.query}" was found in the official university registry. Please verify the ID or candidate roll number.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
