import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertTriangle, Minus, Maximize2, Move } from 'lucide-react';

export const WebcamProctor = ({ isActive = true, onViolation, candidateName = 'Candidate' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Start minimized on mobile/small viewports so options & Next button are never blocked
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [proctorStatus, setProctorStatus] = useState('CALIBRATING'); // CALIBRATING, MONITORING, WARNING
  const [warningMessage, setWarningMessage] = useState('');
  const consecutiveMissingRef = useRef(0);

  // Movable / Draggable coordinates (left, top)
  const [position, setPosition] = useState(() => {
    if (typeof window === 'undefined') return { x: 20, y: 20 };
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return { x: Math.max(8, window.innerWidth - 156), y: 12 };
    }
    return {
      x: Math.max(16, window.innerWidth - 276),
      y: Math.max(16, window.innerHeight - 250)
    };
  });

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    hasMoved: false
  });

  // Keep widget inside screen bounds if orientation or window resizes
  useEffect(() => {
    const clampPosition = () => {
      if (typeof window === 'undefined') return;
      const elWidth = containerRef.current?.offsetWidth || (isMinimized ? 148 : 248);
      const elHeight = containerRef.current?.offsetHeight || (isMinimized ? 36 : 210);
      setPosition(prev => ({
        x: Math.min(Math.max(8, prev.x), Math.max(8, window.innerWidth - elWidth - 8)),
        y: Math.min(Math.max(8, prev.y), Math.max(8, window.innerHeight - elHeight - 8))
      }));
    };

    window.addEventListener('resize', clampPosition);
    clampPosition();
    return () => window.removeEventListener('resize', clampPosition);
  }, [isMinimized]);

  // Pointer drag handlers (works seamlessly on Mobile Touch + Desktop Mouse)
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!dragStateRef.current.isDragging) return;
      const dx = e.clientX - dragStateRef.current.startX;
      const dy = e.clientY - dragStateRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStateRef.current.hasMoved = true;
      }

      const elWidth = containerRef.current?.offsetWidth || (isMinimized ? 148 : 248);
      const elHeight = containerRef.current?.offsetHeight || (isMinimized ? 36 : 210);

      const nextX = Math.min(
        Math.max(8, dragStateRef.current.originX + dx),
        Math.max(8, window.innerWidth - elWidth - 8)
      );
      const nextY = Math.min(
        Math.max(8, dragStateRef.current.originY + dy),
        Math.max(8, window.innerHeight - elHeight - 8)
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      dragStateRef.current.isDragging = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isMinimized]);

  const startDrag = (e) => {
    // Do not start drag if user tapped the minimize/expand button
    if (e.target.closest('button')) return;
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      hasMoved: false
    };
  };

  // Initialize camera stream (stays active in background even when minimized)
  useEffect(() => {
    let currentStream = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API unavailable in this browser');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
            if (isMounted) {
              setStreamActive(true);
              setProctorStatus('MONITORING');
            }
          };
        }
      } catch (err) {
        console.warn("Webcam access error:", err);
        if (isMounted) {
          setCameraError(err.message || 'Camera permission denied or camera not found');
          setProctorStatus('WARNING');
        }
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  // Periodic background frame presence analysis (works both expanded & minimized)
  useEffect(() => {
    if (!streamActive || !isActive) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState >= 2) {
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);

        try {
          if (window.FaceDetector) {
            const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
            const faces = await faceDetector.detect(canvas);

            if (faces.length === 0) {
              consecutiveMissingRef.current += 1;
              if (consecutiveMissingRef.current >= 3) {
                setProctorStatus('WARNING');
                setWarningMessage('Face not centered in frame');
                onViolation?.('Webcam Alert: Student face missing from camera frame');
              }
            } else if (faces.length > 1) {
              setProctorStatus('WARNING');
              setWarningMessage('Multiple faces detected');
              onViolation?.('Webcam Alert: Multiple individuals detected in frame');
            } else {
              consecutiveMissingRef.current = 0;
              setProctorStatus('MONITORING');
              setWarningMessage('');
            }
            return;
          }
        } catch (e) {
          // Fallback to luminance check
        }

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
    <div
      ref={containerRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className={`fixed z-40 select-none transition-shadow duration-200 ${
        isMinimized
          ? 'rounded-full glass-panel border border-indigo-500/40 bg-slate-950/90 shadow-xl'
          : 'w-56 sm:w-64 rounded-2xl glass-panel border border-slate-700/70 shadow-2xl overflow-hidden bg-slate-950/95'
      } text-white`}
    >
      {/* Hidden Canvas for Frame Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Minimized Compact Floating Pill (keeps <video> active in background without blocking quiz UI) */}
      {isMinimized ? (
        <div
          onPointerDown={startDrag}
          className="flex items-center space-x-2 px-3 py-1.5 cursor-grab active:cursor-grabbing touch-none"
          title="Drag to move • Camera running in background"
        >
          <Move className="w-3 h-3 text-slate-400 shrink-0" />
          <div className={`w-2 h-2 rounded-full shrink-0 ${
            proctorStatus === 'MONITORING' ? 'bg-emerald-400 animate-pulse' :
            proctorStatus === 'WARNING' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
          }`} />
          <span className="text-[11px] font-bold tracking-tight text-slate-200 whitespace-nowrap">
            {warningMessage ? 'Cam Alert!' : streamActive ? 'Cam Active' : cameraError ? 'No Cam' : 'Proctor...'}
          </span>

          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-full bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 hover:text-white transition-all shrink-0"
            title="Show Camera Preview"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* Expanded Header Bar (Draggable + Clear Minimize '-' Button) */
        <div
          onPointerDown={startDrag}
          className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold cursor-grab active:cursor-grabbing touch-none"
          title="Drag to move camera window anywhere"
        >
          <div className="flex items-center space-x-1.5">
            <Move className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              proctorStatus === 'MONITORING' ? 'bg-emerald-400 animate-pulse' :
              proctorStatus === 'WARNING' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
            }`} />
            <span className="tracking-tight text-slate-300">AI PROCTOR HUD</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            title="Minimize (-) — Camera stays active in background"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Video Element (Always mounted so stream & background AI proctoring keep working while minimized) */}
      <div
        className={
          isMinimized
            ? 'w-1 h-1 opacity-0 pointer-events-none absolute overflow-hidden'
            : 'relative bg-black h-32 sm:h-36 overflow-hidden'
        }
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />

        {!isMinimized && (
          <>
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
          </>
        )}
      </div>

      {/* Footer Info (Only shown when expanded) */}
      {!isMinimized && (
        <div className="px-3 py-1.5 bg-slate-900/60 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 truncate max-w-[120px]">{candidateName}</span>
          <span className={`font-semibold ${
            proctorStatus === 'MONITORING' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {proctorStatus === 'MONITORING' ? 'SECURE' : 'CAUTION'}
          </span>
        </div>
      )}
    </div>
  );
};
