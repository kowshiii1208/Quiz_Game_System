import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertTriangle, ShieldCheck, Eye, EyeOff, Minimize2, Maximize2 } from 'lucide-react';

export const WebcamProctor = ({ isActive = true, onViolation, candidateName = 'Candidate' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [proctorStatus, setProctorStatus] = useState('CALIBRATING'); // CALIBRATING, MONITORING, WARNING
  const [warningMessage, setWarningMessage] = useState('');
  const [consecutiveMissingFrames, setConsecutiveMissingFrames] = useState(0);

  // Initialize camera stream
  useEffect(() => {
    let currentStream = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          },
          audio: false
        });

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setStreamActive(true);
            setProctorStatus('MONITORING');
          };
        }
      } catch (err) {
        console.warn("Webcam access error:", err);
        setCameraError(err.message || 'Camera permission denied or camera not found');
        setProctorStatus('WARNING');
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  // Periodic frame presence analysis
  useEffect(() => {
    if (!streamActive || !isActive) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);

        try {
          // Native Chromium FaceDetector API support
          if (window.FaceDetector) {
            const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
            const faces = await faceDetector.detect(canvas);
            
            if (faces.length === 0) {
              setConsecutiveMissingFrames(prev => {
                const next = prev + 1;
                if (next >= 3) {
                  setProctorStatus('WARNING');
                  setWarningMessage('Face not centered in frame');
                  onViolation?.('Webcam Alert: Student face missing from camera frame');
                }
                return next;
              });
            } else if (faces.length > 1) {
              setProctorStatus('WARNING');
              setWarningMessage('Multiple faces detected');
              onViolation?.('Webcam Alert: Multiple individuals detected in frame');
            } else {
              setConsecutiveMissingFrames(0);
              setProctorStatus('MONITORING');
              setWarningMessage('');
            }
            return;
          }
        } catch (e) {
          // Ignore FaceDetector error and fallback to luminance presence check
        }

        // Luminance presence check (detects if camera is covered or dark)
        const frameData = ctx.getImageData(0, 0, 160, 120).data;
        let brightnessSum = 0;
        for (let i = 0; i < frameData.length; i += 4) {
          brightnessSum += (frameData[i] + frameData[i + 1] + frameData[i + 2]) / 3;
        }
        const avgBrightness = brightnessSum / (frameData.length / 4);

        if (avgBrightness < 15) {
          setProctorStatus('WARNING');
          setWarningMessage('Camera lens obscured / dark');
          onViolation?.('Webcam Alert: Camera covered or room too dark');
        } else {
          setProctorStatus('MONITORING');
          setWarningMessage('');
        }
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [streamActive, isActive, onViolation]);

  return (
    <div className={`transition-all duration-300 ${
      isMinimized ? 'w-48' : 'w-64'
    } rounded-2xl glass-panel border border-slate-700/60 shadow-2xl overflow-hidden bg-slate-950/90 text-white z-40 select-none`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold">
        <div className="flex items-center space-x-1.5">
          <div className={`w-2 h-2 rounded-full ${
            proctorStatus === 'MONITORING' ? 'bg-emerald-400 animate-pulse' : 
            proctorStatus === 'WARNING' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
          }`} />
          <span className="tracking-tight text-slate-300">AI PROCTOR HUD</span>
        </div>

        <button
          onClick={() => setIsMinimized(prev => !prev)}
          className="p-1 rounded text-slate-400 hover:text-white"
          title={isMinimized ? "Expand Camera" : "Minimize Camera"}
        >
          {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Video Preview */}
      <div className={`relative bg-black transition-all overflow-hidden ${
        isMinimized ? 'h-16' : 'h-36'
      }`}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />

        {/* Hidden Canvas for Frame Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanline Animation Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent animate-pulse-slow" />

        {/* Status Indicator Overlays */}
        {!streamActive && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-slate-950/90">
            <Camera className="w-5 h-5 text-indigo-400 animate-spin mb-1" />
            <span className="text-[10px] text-slate-400">Initializing Optical Feed...</span>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-slate-950/95 text-rose-400">
            <CameraOff className="w-5 h-5 mb-1 text-rose-500" />
            <span className="text-[10px] leading-tight font-medium">Virtual Feed Active (No Hardware Cam)</span>
          </div>
        )}

        {/* Warning Toast */}
        {warningMessage && (
          <div className="absolute bottom-1 left-1 right-1 px-2 py-1 bg-rose-600/90 rounded text-[10px] font-bold text-white flex items-center space-x-1 shadow-lg">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{warningMessage}</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-slate-900/60 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 truncate max-w-[120px]">{candidateName}</span>
        <span className={`font-semibold ${
          proctorStatus === 'MONITORING' ? 'text-emerald-400' : 'text-amber-400'
        }`}>
          {proctorStatus === 'MONITORING' ? 'SECURE' : 'CAUTION'}
        </span>
      </div>

    </div>
  );
};
