import React, { useRef, useState } from 'react';
import { Award, Printer, Download, X, ShieldCheck, Sparkles, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const CertificateModal = ({ result, onClose }) => {
  const certRef = useRef(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  if (!result) return null;

  const { student, percentage, score, maxScore } = result;
  const certDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const certId = `AU-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

  // Browser Print trigger (configured via @media print for landscape)
  const handlePrint = () => {
    window.print();
  };

  // High-Quality Direct Landscape PDF Downloader
  const handleSavePDF = async () => {
    if (!certRef.current) return;
    try {
      setIsExportingPDF(true);
      const elem = certRef.current;

      const canvas = await html2canvas(elem, {
        scale: 3, // High DPI for crisp vector-like text
        useCORS: true,
        backgroundColor: '#090d16',
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
      // Fallback to print dialog
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  // High-Resolution Canvas PNG Downloader
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 850;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background Gradient & Border
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#090d16');
    bgGradient.addColorStop(0.5, '#0f172a');
    bgGradient.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Double Golden Frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(25, 25, width - 50, height - 50);
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Corner Accents
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(25, 25, 30, 6);
    ctx.fillRect(25, 25, 6, 30);
    ctx.fillRect(width - 55, 25, 30, 6);
    ctx.fillRect(width - 31, 25, 6, 30);
    ctx.fillRect(25, height - 31, 30, 6);
    ctx.fillRect(25, height - 55, 6, 30);
    ctx.fillRect(width - 55, height - 31, 30, 6);
    ctx.fillRect(width - 31, height - 55, 6, 30);

    // Load Aditya Logo
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/aditya_logo.png";
    img.onload = () => {
      ctx.drawImage(img, 70, 60, 150, 60);
      drawCertificateText(ctx, width, height);
    };
    img.onerror = () => {
      drawCertificateText(ctx, width, height);
    };

    function drawCertificateText(ctx, width, height) {
      // Header Titles
      ctx.textAlign = "center";
      
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("ADITYA UNIVERSITY • DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", width / 2, 85);

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 44px serif";
      ctx.fillText("CERTIFICATE OF MERIT", width / 2, 145);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.fillText("THIS IS PROUDLY PRESENTED TO", width / 2, 185);

      // Student Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(student.name.toUpperCase(), width / 2, 240);

      // Underline
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 250, 255);
      ctx.lineTo(width / 2 + 250, 255);
      ctx.stroke();

      // Student Meta
      ctx.fillStyle = "#818cf8";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`Roll No: ${student.rollNumber}  |  College: ${student.college}`, width / 2, 290);

      // Certification Body Paragraph
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "17px sans-serif";
      ctx.fillText("for successfully passing the official online assessment in", width / 2, 345);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`Object-Oriented Programming & C++ Architecture (${student.difficulty} Level)`, width / 2, 380);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "17px sans-serif";
      ctx.fillText(`achieving a score of ${Math.round(percentage)}% (${score}/${maxScore} Marks) with distinction.`, width / 2, 415);

      // Verification Badge Box
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 1;
      ctx.fillRect(width / 2 - 180, 450, 360, 45);
      ctx.strokeRect(width / 2 - 180, 450, 360, 45);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(`✓ VERIFIED EXAMINATION PASS • ID: ${certId}`, width / 2, 478);

      // Signatures Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(100, 560);
      ctx.lineTo(width - 100, 560);
      ctx.stroke();

      // Signatures Section
      // Left: Mentor SK. VAHIDA
      ctx.textAlign = "left";
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "italic bold 20px serif";
      ctx.fillText("SK. Vahida", 120, 620);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("SK. VAHIDA, M.Tech(Ph.D)", 120, 650);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("Assistant Professor & Project Mentor", 120, 672);

      // Center: Date & University Seal
      ctx.textAlign = "center";
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("OFFICIAL SEAL", width / 2, 620);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "13px sans-serif";
      ctx.fillText(`Issued: ${certDate}`, width / 2, 645);
      ctx.fillText("Aditya University Academic Board", width / 2, 665);

      // Right: HOD / Director
      ctx.textAlign = "right";
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "italic bold 20px serif";
      ctx.fillText("Dr. K. Srinivasa Rao", width - 120, 620);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Dr. K. Srinivasa Rao, Ph.D", width - 120, 650);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("Head of Department (CSE)", width - 120, 672);

      // Download trigger
      const link = document.createElement('a');
      link.download = `Aditya_University_Certificate_${student.rollNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full space-y-4 my-auto">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between text-white px-2 gap-3">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-amber-300">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Certificate Preview</span>
          </div>

          <div className="flex items-center space-x-2.5">
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
          className="bg-slate-950 border-8 border-double border-amber-500/70 rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl text-slate-100 aspect-[1.414/1] flex flex-col justify-between"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-400" />

          {/* Top Header with Aditya Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 gap-4">
            
            <div className="flex items-center space-x-4">
              <img 
                src="/aditya_logo.png" 
                alt="Aditya University Logo" 
                className="h-12 sm:h-16 object-contain filter drop-shadow-md"
              />
              <div className="text-left">
                <h2 className="text-base sm:text-2xl font-black text-amber-300 tracking-tight font-serif uppercase">
                  ADITYA UNIVERSITY
                </h2>
                <p className="text-[9px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  Department of Computer Science & Engineering
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] sm:text-xs text-amber-400 font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shrink-0">
              Official Merit Assessment
            </div>

          </div>

          {/* Body Section */}
          <div className="my-auto space-y-4 py-2">
            
            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-amber-300 tracking-tight font-serif uppercase">
                Certificate of Merit
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-semibold">
                THIS IS PROUDLY PRESENTED TO
              </p>
            </div>

            {/* Candidate Name */}
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white border-b-2 border-amber-400/40 pb-1.5 inline-block px-8 tracking-wide">
                {student.name}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-2">
                Roll No: <span className="font-bold text-white">{student.rollNumber}</span> • Institute: <span className="font-bold text-white">{student.college}</span>
              </p>
            </div>

            {/* Certification Text */}
            <p className="max-w-3xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
              for successfully passing the official online assessment in <strong className="text-white">Object-Oriented Programming & C++ Architecture ({student.difficulty} Level)</strong>, achieving an outstanding score of <strong className="text-emerald-400 text-base font-bold">{Math.round(percentage)}%</strong> ({score}/{maxScore} Marks) with distinction.
            </p>

            {/* Verification Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED ACADEMIC EXAMINATION PASS • ID: {certId}</span>
            </div>

          </div>

          {/* Signatures Grid */}
          <div className="grid grid-cols-3 gap-4 items-end pt-4 border-t border-slate-800 text-xs">
            
            {/* Left: Mentor SK. VAHIDA */}
            <div className="text-left space-y-0.5">
              <div className="font-serif italic text-sm sm:text-lg text-slate-200 font-bold border-b border-slate-700 pb-0.5 inline-block">
                SK. Vahida
              </div>
              <p className="font-bold text-amber-300 text-[11px] sm:text-xs">SK. VAHIDA, M.Tech(Ph.D)</p>
              <p className="text-slate-400 text-[9px] sm:text-[11px]">Assistant Professor & Project Mentor</p>
            </div>

            {/* Center: University Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" />
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Issued: {certDate}</p>
            </div>

            {/* Right: HOD Signature */}
            <div className="text-right space-y-0.5">
              <div className="font-serif italic text-sm sm:text-lg text-slate-200 font-bold border-b border-slate-700 pb-0.5 inline-block">
                Dr. K. Srinivasa Rao
              </div>
              <p className="font-bold text-amber-300 text-[11px] sm:text-xs">Dr. K. Srinivasa Rao, Ph.D</p>
              <p className="text-slate-400 text-[9px] sm:text-[11px]">Head of Department (CSE)</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
