import { useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import "./VideoCard.css";

function VideoCard({
  stream,
  muted = false,
  name = "You",
  micOn = true,
  cameraOn = true,
  isLocal = false,
}) {
  const videoRef = useRef(null);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
    console.log({
        name,
        isLocal,
        initials,
      });
  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="video-card">
      {/* Mic & Camera Status */}
      <div className="media-status">
        <div className={`status-icon ${micOn ? "on" : "off"}`}>
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </div>

        <div className={`status-icon ${cameraOn ? "on" : "off"}`}>
          {cameraOn ? <FaVideo /> : <FaVideoSlash />}
        </div>
      </div>

      {/* Video */}
      {cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
        />
      ) : (
        <div className="camera-off">
          <div className="avatar">
            {initials}
          </div>
        </div>
      )}

      {/* User Name */}
      <div className="video-name">
  {isLocal ? `${name} (You)` : name}
</div>
    </div>
  );
}

export default VideoCard;