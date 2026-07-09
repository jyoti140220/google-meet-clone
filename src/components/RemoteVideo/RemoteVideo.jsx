import { useEffect, useRef } from "react";
import "./RemoteVideo.css";
function RemoteVideo({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="remote-video"
    />
  );
}

export default RemoteVideo;