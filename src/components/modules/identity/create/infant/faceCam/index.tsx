import React, { useRef, useState, useEffect } from "react";

interface FaceCamProps {
  onCapture: (base64Image: string) => void;
}

const FaceCam: React.FC<FaceCamProps> = ({ onCapture }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isFrontCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
        },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error starting camera:", error);

      setErrorMessage("Failed to start camera. Please check your camera permissions.");

    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/png");
        onCapture(base64Image);
      }
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <div className="facecam-container">
      {errorMessage && (
        <div className="text-red-500 bg-red-100 p-2 rounded-lg mb-2 text-sm">
          {errorMessage}
        </div>)}
      <div className="video-wrapper max-w-sm ">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-lg border"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="controls flex gap-2 mt-4">
        <span
          onClick={captureImage}
          className="px-4 py-2 bg-green-700 text-white rounded-lg"
        >
          Capture
        </span>
        <span
          onClick={toggleCamera}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          Switch Camera
        </span>
      </div>
    </div>
  );
};

export default FaceCam;
