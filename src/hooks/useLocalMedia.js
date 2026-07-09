import { useRef, useState } from "react";
import socket from "../services/socket";
function useLocalMedia() {
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [localStream, setLocalStream] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.log(err);
    }
  };

  const stopCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleMic = (roomId) => {
    const track = localStreamRef.current?.getAudioTracks()[0];
  
    if (!track) return;
  
    track.enabled = !track.enabled;
  
    setMicOn(track.enabled);
  
    socket.emit("mic-toggle", {
      roomId,
      micOn: track.enabled,
    });
  };

  const toggleCamera = (roomId) => {
    const track = localStreamRef.current?.getVideoTracks()[0];
  
    if (!track) return;
  
    track.enabled = !track.enabled;
  
    setCameraOn(track.enabled);
  
    socket.emit("camera-toggle", {
      roomId,
      cameraOn: track.enabled,
    });
  };

  return {
    videoRef,
    localStream,
    localStreamRef,

    micOn,
    cameraOn,

    startCamera,
    stopCamera,

    toggleMic,
    toggleCamera,
  };
}

export default useLocalMedia;