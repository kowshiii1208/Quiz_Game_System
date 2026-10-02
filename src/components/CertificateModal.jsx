import React, { useRef, useState, useEffect } from 'react';
import { Award, Download, X, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export const CertificateModal = ({ result, settings = {}, onClose, onOpenVerification }) => {
  const certRef = useRef(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  if (!result) return null;

  const { student, percentage, score, maxScore } = result;
  
  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const certId = `AU-CERT-${student?.rollNumber || '849201'}-${Math.floor(100 + Math.random() * 900)}`;

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

  const langName = student.language === 'JAVA' ? 'Java Enterprise Architecture' : 
                   student.language === 'PYTHON' ? 'Python & Algorithmic Architecture' : 
                   'Object-Oriented Programming & C++ Architecture';

  // Generate QR code data URL on component mount
  useEffect(() => {
    const verificationPayload = JSON.stringify({
      certId,
      name: student.name,
      roll: student.rollNumber,
      college: student.college,
      score: `${Math.round(percentage)}%`,
      lang: student.language || 'CPP',
      status: 'VERIFIED_GENUINE',
      issuer: 'Aditya University CSE Dept'
    });

    QRCode.toDataURL(verificationPayload, {
      margin: 1,
      width: 150,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error("QR Code Generation Error:", err));
  }, [certId, student, percentage]);

  // High-Quality Direct Landscape PDF Downloader
  const handleSavePDF = async () => {
    if (!certRef.current) return;
    try {
      setIsExportingPDF(true);
      const elem = certRef.current;

      const canvas = await html2canvas(elem, {
        scale: 3, // High DPI for crisp vector text
        useCORS: true,
        backgroundColor: '#070a13',
        logging: false,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Aditya_University_Certificate_${student.rollNumber || 'Pass'}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full space-y-4 my-auto">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between text-white px-2 gap-3">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-amber-300">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Merit Certificate Preview & Verification</span>
          </div>

          <div className="flex items-center space-x-2.5">
            {onOpenVerification && (
              <button
                onClick={() => onOpenVerification(certId)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50 text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Registry</span>
              </button>
            )}

            <button
              onClick={handleSavePDF}
              disabled={isExportingPDF}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
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
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Frame Container (Landscape Ratio Aspect) */}
        <div 
          ref={certRef}
          id="certificate-print-area"
          className="bg-[#070a13] border-8 border-double border-amber-500/70 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl text-slate-100 aspect-[1.414/1] flex flex-col justify-between"
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
                className="h-12 sm:h-16 object-contain filter drop-shadow-md"
              />
              <div className="text-left">
                <h2 className="text-base sm:text-2xl font-black text-amber-300 tracking-tight font-serif uppercase">
                  {collegeName}
                </h2>
                <p className="text-[9px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  {departmentName}
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] sm:text-xs text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shrink-0">
              Official Academic Merit Assessment
            </div>

          </div>

          {/* Body Section */}
          <div className="my-auto space-y-4 py-2 relative z-10">
            
            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-300 tracking-tight font-serif uppercase drop-shadow-md">
                Certificate of Merit
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-semibold">
                THIS IS PROUDLY PRESENTED TO
              </p>
            </div>

            {/* Candidate Name */}
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white border-b-2 border-amber-400/50 pb-1.5 inline-block px-8 tracking-wide">
                {student.name}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-2">
                Roll No: <span className="font-bold text-white">{student.rollNumber}</span> • College: <span className="font-bold text-white">{student.college}</span>
              </p>
            </div>

            {/* Certification Text */}
            <p className="max-w-3xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {certBodyText} <strong className="text-white font-bold">{langName} ({student.difficulty} Level)</strong>, achieving an outstanding score of <strong className="text-emerald-400 text-base font-bold">{Math.round(percentage)}%</strong> ({score}/{maxScore} Marks) with academic distinction.
            </p>

            {/* Verification Pill & QR Code Container */}
            <div className="flex items-center justify-center space-x-3 pt-1">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>OFFICIALLY VERIFIED EXAM PASS • ID: {certId}</span>
              </div>
            </div>

          </div>

          {/* Signatures & QR Verification Footer Grid */}
          <div className="grid grid-cols-4 gap-2 items-end pt-4 border-t border-slate-800 text-xs relative z-10">
            
            {/* 1. Left: Project Mentor */}
            <div className="text-left space-y-0.5">
              <div className="font-serif italic text-sm sm:text-lg text-slate-200 font-bold border-b border-slate-700 pb-0.5 inline-block">
                {mentorName}
              </div>
              <p className="font-bold text-amber-300 text-[10px] sm:text-xs">{mentorTitle}</p>
              <p className="text-slate-400 text-[8px] sm:text-[10px]">{mentorRole}</p>
            </div>

            {/* 2. QR Code Verification Stamp */}
            <div className="flex flex-col items-center justify-center">
              {qrCodeDataUrl ? (
                <div className="bg-white p-1 rounded-xl shadow-md border border-amber-400/50">
                  <img src={qrCodeDataUrl} alt="Certificate Verification QR Code" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-[9px] text-slate-500">
                  Generating QR...
                </div>
              )}
              <span className="text-[8px] font-extrabold text-amber-400 mt-1 uppercase tracking-widest">Scan to Verify</span>
            </div>

            {/* 3. Center: University Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
              </div>
              <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1">Issued: {certDate}</p>
            </div>

            {/* 4. Right: HOD Signature */}
            <div className="text-right space-y-0.5">
              <div className="font-serif italic text-sm sm:text-lg text-slate-200 font-bold border-b border-slate-700 pb-0.5 inline-block">
                {hodName}
              </div>
              <p className="font-bold text-amber-300 text-[10px] sm:text-xs">{hodTitle}</p>
              <p className="text-slate-400 text-[8px] sm:text-[10px]">{hodRole}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
