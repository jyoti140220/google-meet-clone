import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaVideo,
    FaVideoSlash,
    FaPhoneAlt,
    FaDesktop,
    FaRegSmile,
    FaClosedCaptioning,
    FaHandPaper,
    FaEllipsisV,
  } from "react-icons/fa";
  
  import "./Controls.css";
  
  function Controls({
    micOn,
    cameraOn,
    isSharing = false,
    toggleMic,
    toggleCamera,
    shareScreen,
    leaveMeeting,
  }) {
    return (
      <div className="controls">
  
        {/* Mic */}
        <button
          className={`control-btn ${!micOn ? "danger" : ""}`}
          onClick={toggleMic}
          title={micOn ? "Turn off microphone" : "Turn on microphone"}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
  
        {/* Camera */}
        <button
          className={`control-btn ${!cameraOn ? "danger" : ""}`}
          onClick={toggleCamera}
          title={cameraOn ? "Turn off camera" : "Turn on camera"}
        >
          {cameraOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
  
        {/* Screen Share */}
        <button
          className={`control-btn ${isSharing ? "active" : ""}`}
          onClick={shareScreen}
          title="Present now"
        >
          <FaDesktop />
        </button>
  
        {/* Reactions */}
        <button
          className="control-btn"
          title="Reactions"
        >
          <FaRegSmile />
        </button>
  
        {/* Captions */}
        <button
          className="control-btn"
          title="Captions"
        >
          <FaClosedCaptioning />
        </button>
  
        {/* Raise Hand */}
        <button
          className="control-btn"
          title="Raise hand"
        >
          <FaHandPaper />
        </button>
  
        {/* More */}
        <button
          className="control-btn"
          title="More options"
        >
          <FaEllipsisV />
        </button>
  
        {/* Leave */}
        <button
          className="leave-btn"
          onClick={leaveMeeting}
          title="Leave call"
        >
          <FaPhoneAlt />
        </button>
  
      </div>
    );
  }
  
  export default Controls;