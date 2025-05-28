import React, { useRef, useEffect, useState, useCallback } from 'react';
import { XCircleIcon, CameraIcon, RefreshCwIcon } from './icons'; // Added RefreshCwIcon for consistency

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const [isUsingUserFacingCamera, setIsUsingUserFacingCamera] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(true);

  const startCamera = useCallback(async () => {
    setIsCameraStarting(true);
    setError(null);
    setStream(null); // Ensure old stream is cleared before starting new one
    let mediaStream: MediaStream | null = null;
    let currentError: string | null = null;
    let usedUserFacing = false;

    const commonVideoConstraints = {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
    };

    const constraintsAttempts: MediaStreamConstraints[] = [
        { video: { ...commonVideoConstraints, facingMode: "environment" } }, // Preferred: rear camera
        { video: { ...commonVideoConstraints, facingMode: { ideal: "environment" } } }, // Fallback for some browsers
        { video: commonVideoConstraints }, // Any camera with resolution
        { video: true } // Simplest fallback: any camera
    ];
    
    for (let i = 0; i < constraintsAttempts.length; i++) {
        try {
            console.log(`Attempting camera with constraints (attempt ${i+1}):`, constraintsAttempts[i]);
            mediaStream = await navigator.mediaDevices.getUserMedia(constraintsAttempts[i]);
            const settings = mediaStream.getVideoTracks()[0]?.getSettings();
            usedUserFacing = settings?.facingMode === 'user' || (!settings?.facingMode && i > 1); // Heuristic for user-facing
            console.log(`Camera started (attempt ${i+1}). Facing mode: ${settings?.facingMode}, Deduced user-facing: ${usedUserFacing}`);
            currentError = null; // Clear previous attempt's error
            break; // Success
        } catch (err) {
            console.warn(`Camera attempt ${i+1} failed:`, err);
            if (err instanceof Error) {
                currentError = `Attempt ${i+1}: ${err.name} - ${err.message}.`;
                if (err.name === "NotAllowedError") {
                    currentError = "Camera permission denied. Please enable camera access in your browser settings.";
                    break; // No point in trying further if permission denied
                }
                if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                     currentError = "No camera found. Please ensure a camera is connected and enabled.";
                } else if (err.name === "NotReadableError" || err.name === "TrackStartError" || err.message.toLowerCase().includes("could not start video source")) {
                    currentError = "Camera is currently in use by another application or could not start. Please close other apps using the camera or try a different one.";
                }
            } else {
                currentError = `An unknown error occurred on attempt ${i+1}.`;
            }
        }
    }


    setIsCameraStarting(false);
    if (mediaStream) {
      setStream(mediaStream);
      setIsUsingUserFacingCamera(usedUserFacing);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setDimensions({ width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
            setError(null); 
          }
        };
        videoRef.current.onstalled = () => console.warn('Video stream stalled.');
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setError("An error occurred with the video stream. Please try again.");
          mediaStream?.getTracks().forEach(track => track.stop());
          setStream(null);
        };
      }
    } else if (currentError) {
      setError(currentError);
    } else {
      // This case should ideally be covered by the loop's error handling.
      setError("Unable to start camera after multiple attempts. Please check permissions and ensure the camera is not in use.");
    }
  }, []); 

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) { // Ensure stream is active
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        if (isUsingUserFacingCamera) {
            context.save();
            context.scale(-1, 1);
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            context.restore();
        } else {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    } else {
        setError("Camera not ready or stream lost. Please try reopening the camera.");
    }
  };

  if (isCameraStarting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary mb-4"></div>
        <p className="text-white text-xl font-medium">Starting camera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
        <div className="bg-brand-surface dark:bg-dark-brand-surface p-6 rounded-lg shadow-xl text-center max-w-md w-full">
          <XCircleIcon className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2 text-brand-text-primary dark:text-dark-brand-text-primary">Camera Error</h3>
          <p className="text-brand-text-secondary dark:text-dark-brand-text-secondary mb-6 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-100 rounded-lg transition-all-smooth font-medium"
            >
              Close
            </button>
            <button
              onClick={startCamera}
              className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover dark:bg-dark-brand-primary dark:hover:bg-dark-brand-primary-hover text-white rounded-lg transition-all-smooth font-medium flex items-center justify-center"
            >
              <RefreshCwIcon className="w-5 h-5 mr-2"/>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-1 sm:p-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted 
        className="w-full h-auto max-h-[calc(100vh-120px)] rounded-lg shadow-2xl object-contain bg-slate-800"
        style={isUsingUserFacingCamera ? { transform: 'scaleX(-1)' } : {}}
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex justify-around items-center h-[100px]">
        <button
          onClick={onClose}
          className="p-3 bg-slate-100/20 hover:bg-slate-100/30 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 backdrop-blur-sm rounded-full text-white transition-all-smooth"
          aria-label="Close camera"
        >
          <XCircleIcon className="w-7 h-7" />
        </button>
        <button
          onClick={handleCapture}
          disabled={!stream || !dimensions}
          className="p-4 bg-brand-primary hover:bg-brand-primary-hover dark:bg-dark-brand-primary dark:hover:bg-dark-brand-primary-hover disabled:bg-orange-300 dark:disabled:bg-orange-800 disabled:cursor-not-allowed rounded-full text-white transition-all-smooth transform active:scale-95 shadow-lg"
          aria-label="Capture photo"
        >
          <CameraIcon className="w-9 h-9" />
        </button>
         <div className="w-12 h-12"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default CameraCapture;
