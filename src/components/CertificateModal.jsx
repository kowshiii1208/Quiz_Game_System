import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Award, Download, X, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { CryptoService } from '../services/cryptoService';

const CERT_WIDTH = 1122;
const CERT_HEIGHT = 794;

export const CertificateModal = ({ result, settings = {}, onClose, onOpenVerification }) => {
  const certRef = useRef(null);
  const exportRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportError, setExportError] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [certSignature, setCertSignature] = useState('');

  const student = result?.student;
  const percentage = result?.percentage ?? 0;
  const score = result?.score ?? 0;
  const maxScore = result?.maxScore ?? 0;

  const certDate = useMemo(() => {
    return result?.certDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [result?.certDate]);

  const certId = useMemo(() => {
    return result?.certId || `AU-CERT-${student?.rollNumber || '849201'}-${Math.floor(100 + Math.random() * 900)}`;
  }, [result?.certId, student?.rollNumber]);

  // Generate SHA-256 Digital Signature and QR code once when result changes
  useEffect(() => {
    if (!result || !student) return;
    let isCancelled = false;

    const generateSignedCertificate = async () => {
      try {
        const signature = result.certSignature || await CryptoService.generateCertificateSignature({
          certId,
          rollNumber: student?.rollNumber,
          name: student?.name,
          score,
          maxScore,
          percentage,
          date: certDate
        });

        if (isCancelled) return;
        setCertSignature(signature);

        const verificationPayload = JSON.stringify({
          certId,
          name: student.name,
          roll: student.rollNumber,
          college: student.college,
          score: `${Math.round(percentage)}%`,
          lang: student.language || 'CPP',
          sha256: signature.slice(0, 16),
          status: 'CRYPTOGRAPHICALLY_VERIFIED',
          issuer: 'Aditya University CSE Dept'
        });

        const url = await QRCode.toDataURL(verificationPayload, {
          margin: 1,
          width: 150,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        if (!isCancelled) {
          setQrCodeDataUrl(url);
        }
      } catch (err) {
        console.error("Certificate Signing / QR Error:", err);
      }
    };

    generateSignedCertificate();
    return () => { isCancelled = true; };
  }, [result, certId, student, percentage, score, maxScore, certDate]);

  if (!result || !student) return null;

  // Default Fallbacks for Certificate Signatories & Settings
  const collegeName = settings.collegeName || "ADITYA UNIVERSITY";
  const departmentName = settings.departmentName || "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING";
  const certBodyText = settings.certBodyText || "for successfully passing the official online assessment in";
  
  const mentorName = settings.mentorName || "SK. VAHIDA";
  const mentorTitle = settings.mentorTitle || "SK. VAHIDA, M.Tech(Ph.D)";
  const mentorRole = settings.mentorRole || "Assistant Professor & Project Mentor";

  const hodName = settings.hodName || "Dr. K. Srinivasa Rao";
  const hodTitle = settings.hodTitle || "Dr. K. Srinivasa Rao, Ph.D";
  const hodRole = settings.hodRole || "Head of Department (CSE)";

  const langName = student.language === 'C' ? 'C Systems & Procedural Programming' :
                   student.language === 'JAVA' ? 'Java Enterprise Architecture' : 
                   student.language === 'PYTHON' ? 'Python & Algorithmic Architecture' : 
                   'Object-Oriented Programming & C++ Architecture';

  // Keep visible landscape A4 certificate proportionally scaled on all screen sizes
  useEffect(() => {
    const updateScale = () => {
      const container = previewContainerRef.current;
      if (!container) return;
      const availableWidth = container.clientWidth;
      if (availableWidth > 0) {
        setPreviewScale(Math.min(1, availableWidth / CERT_WIDTH));
      }
    };

    updateScale();
    let observer;
    if (typeof ResizeObserver !== 'undefined' && previewContainerRef.current) {
      observer = new ResizeObserver(updateScale);
      observer.observe(previewContainerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // Wait for embedded assets (logo & QR code) to finish loading & decoding before capture
  const waitForImagesReady = async (rootElem) => {
    if (!rootElem) return;
    const images = Array.from(rootElem.querySelectorAll('img'));
    await Promise.all(
      images.map(async (img) => {
        if (!img.complete) {
          await new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          });
        }
        if (typeof img.decode === 'function') {
          try {
            await img.decode();
          } catch {
            // Ignore decode rejection for already-loaded data URLs or fallback
          }
        }
      })
    );
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Proceed if FontFaceSet check fails
      }
    }
  };

  // High-Quality Direct Landscape PDF Downloader (desktop & mobile safe)
  const handleSavePDF = async () => {
    const targetElem = exportRef.current || certRef.current;
    if (!targetElem) return;
    try {
      setIsExportingPDF(true);
      setExportError('');

      await waitForImagesReady(targetElem);

      const canvas = await html2canvas(targetElem, {
        scale: 2, // 2244x1588px crisp A4 landscape while staying within mobile canvas RAM limits
        useCORS: true,
        backgroundColor: '#070a13',
        logging: false,
        allowTaint: false,
        width: CERT_WIDTH,
        height: CERT_HEIGHT,
        windowWidth: 1280,
        windowHeight: 900,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          const wrapper = clonedDoc.getElementById('certificate-export-wrapper');
          if (wrapper) {
            wrapper.style.left = '0px';
            wrapper.style.top = '0px';
            wrapper.style.zIndex = '99999';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const safeRoll = String(student.rollNumber || 'Pass').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Aditya_University_Certificate_${safeRoll}.pdf`;
      const pdfBlob = pdf.output('blob');

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const blobUrl = URL.createObjectURL(pdfBlob);
        if (isIOS) {
          const opened = window.open(blobUrl, '_blank');
          if (!opened) {
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.rel = 'noopener';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      } else {
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("PDF Export Error:", err);
      setExportError('Direct PDF save failed on this browser. Opening print dialog instead.');
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const renderCertificateCard = ({ id, cardRef }) => (
    <div
      ref={cardRef}
      id={id}
      style={{ width: `${CERT_WIDTH}px`, height: `${CERT_HEIGHT}px` }}
      className="bg-[#070a13] border-8 border-double border-amber-500/70 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl text-slate-100 flex flex-col justify-between select-none"
    >
      {/* Subtle University Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Award className="w-[500px] h-[500px] text-amber-400" />
      </div>

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-400" />

      {/* Top Header with Aditya Logo */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 gap-4 relative z-10">
        <div className="flex items-center space-x-4">
          <img
            src="/aditya_logo.png"
            alt="Aditya University Logo"
            crossOrigin="anonymous"
            className="h-16 w-auto object-contain filter drop-shadow-md"
          />
          <div className="text-left">
            <h2 className="text-2xl font-black text-amber-300 tracking-tight font-serif uppercase">
              {collegeName}
            </h2>
            <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
              {departmentName}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center justify-center text-xs text-amber-400 font-bold bg-amber-500/10 px-4 py-2 leading-none rounded-full border border-amber-500/30 shrink-0">
          Official Academic Merit Assessment
        </div>
      </div>

      {/* Body Section */}
      <div className="my-auto space-y-5 py-2 relative z-10">
        {/* Title */}
        <div className="space-y-2.5">
          <h1 className="text-5xl font-black text-amber-300 tracking-tight font-serif uppercase drop-shadow-md leading-tight">
            Certificate of Merit
          </h1>
          <p className="text-xs text-slate-400 tracking-widest uppercase font-semibold leading-normal">
            THIS IS PROUDLY PRESENTED TO
          </p>
        </div>

        {/* Candidate Name */}
        <div className="flex flex-col items-center">
          <div className="inline-flex flex-col items-center">
            <h2 className="text-4xl font-extrabold text-white px-8 tracking-wide leading-tight">
              {student.name}
            </h2>
            <div className="w-full h-[2px] bg-amber-400/50 mt-2.5 rounded-full" />
          </div>
          <p className="text-sm text-indigo-300 font-medium mt-2.5">
            Roll No: <span className="font-bold text-white">{student.rollNumber}</span> • College: <span className="font-bold text-white">{student.college}</span>
          </p>
        </div>

        {/* Certification Text */}
        <p className="max-w-3xl mx-auto text-sm text-slate-300 leading-relaxed font-normal">
          {certBodyText} <strong className="text-white font-bold">{langName} ({student.difficulty} Level)</strong>, achieving an outstanding score of <strong className="text-emerald-400 text-base font-bold">{Math.round(percentage)}%</strong> ({score}/{maxScore} Marks) with academic distinction.
        </p>

        {/* Verification Pill & QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-2 pt-1">
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 leading-none rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>OFFICIALLY VERIFIED EXAM PASS • ID: {certId}</span>
          </div>

          {certSignature && (
            <div className="inline-flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-400 bg-slate-900/60 px-3.5 py-1.5 leading-none rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>SHA-256 Digital Fingerprint: {certSignature.slice(0, 24)}...{certSignature.slice(-8)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Signatures & QR Verification Footer Grid */}
      <div className="grid grid-cols-4 gap-4 items-end pt-4 border-t border-slate-800 text-xs relative z-10">
        {/* 1. Left: Project Mentor */}
        <div className="text-left space-y-1">
          <div className="inline-block">
            <div className="font-serif italic text-lg text-slate-200 font-bold leading-tight">
              {mentorName}
            </div>
            <div className="w-full h-px bg-slate-700 mt-1" />
          </div>
          <p className="font-bold text-amber-300 text-xs">{mentorTitle}</p>
          <p className="text-slate-400 text-[10px]">{mentorRole}</p>
        </div>

        {/* 2. QR Code Verification Stamp */}
        <div className="flex flex-col items-center justify-center">
          {qrCodeDataUrl ? (
            <div className="bg-white p-1.5 rounded-xl shadow-md border border-amber-400/50">
              <img src={qrCodeDataUrl} alt="Certificate Verification QR Code" className="w-16 h-16 object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-[9px] text-slate-500">
              Generating QR...
            </div>
          )}
          <span className="text-[8px] font-extrabold text-amber-400 mt-1 uppercase tracking-widest">Scan to Verify</span>
        </div>

        {/* 3. Center: University Seal */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Award className="w-6 h-6 text-slate-950" />
          </div>
          <p className="text-[9px] text-slate-400 mt-1">Issued: {certDate}</p>
        </div>

        {/* 4. Right: HOD Signature */}
        <div className="text-right space-y-1">
          <div className="inline-block">
            <div className="font-serif italic text-lg text-slate-200 font-bold leading-tight">
              {hodName}
            </div>
            <div className="w-full h-px bg-slate-700 mt-1" />
          </div>
          <p className="font-bold text-amber-300 text-xs">{hodTitle}</p>
          <p className="text-slate-400 text-[10px]">{hodRole}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <style>{`
        @media print {
          .cert-print-box {
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .cert-print-stage {
            transform: none !important;
            width: auto !important;
            height: auto !important;
          }
        }
      `}</style>

      <div className="max-w-5xl w-full space-y-3 sm:space-y-4 my-auto py-2">
        {/* Modal Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white px-1 sm:px-2 gap-3">
          <div className="flex items-center justify-between sm:justify-start space-x-2 text-xs sm:text-sm font-semibold text-amber-300">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Merit Certificate Preview & Verification</span>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {onOpenVerification && (
              <button
                onClick={() => onOpenVerification(certId)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Registry</span>
              </button>
            )}

            <button
              onClick={handleSavePDF}
              disabled={isExportingPDF}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Certificate</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {exportError && (
          <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs text-center">
            {exportError}
          </div>
        )}

        {/* Responsive Scaled Preview Frame (keeps exact 1122x794 A4 proportions on mobile & desktop) */}
        <div ref={previewContainerRef} className="w-full overflow-hidden flex justify-center">
          <div
            className="cert-print-box relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl"
            style={{
              width: `${Math.round(CERT_WIDTH * previewScale)}px`,
              height: `${Math.round(CERT_HEIGHT * previewScale)}px`
            }}
          >
            <div
              className="cert-print-stage"
              style={{
                width: `${CERT_WIDTH}px`,
                height: `${CERT_HEIGHT}px`,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left'
              }}
            >
              {renderCertificateCard({ id: 'certificate-print-area', cardRef: certRef })}
            </div>
          </div>
        </div>

        <p className="sm:hidden text-center text-[11px] text-slate-400 px-2">
          Scaled A4 preview for mobile • Tap <span className="text-amber-300 font-semibold">Download Certificate</span> for full HD landscape PDF
        </p>

        {/* Dedicated Unscaled A4 Landscape Offscreen Node for Mobile & Desktop PDF Capture */}
        <div
          id="certificate-export-wrapper"
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-10000px',
            top: '0px',
            width: `${CERT_WIDTH}px`,
            height: `${CERT_HEIGHT}px`,
            pointerEvents: 'none',
            zIndex: -1,
            opacity: 1
          }}
        >
          {renderCertificateCard({ id: 'certificate-export-area', cardRef: exportRef })}
        </div>
      </div>
    </div>
  );
};
