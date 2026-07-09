import { useParams } from "react-router-dom";
import "./Meeting.css";
import Controls from "../../components/Controls/Controls";
import { useNavigate } from "react-router-dom";
import useLocalMedia from "../../hooks/useLocalMedia";
import useSocket from "../../hooks/useSocket";
import useWebRTC from "../../hooks/useWebRTC";
import VideoGrid from "../../components/VideoGrid/VideoGrid";
import { useState, useEffect } from "react";
import socket from "../../services/socket";
import { toast } from "react-toastify";
import JoinMeeting from "../../components/JoinMeeting/JoinMeeting";

function Meeting() {
     const navigate = useNavigate();
    const { roomId } = useParams();
    const [joined, setJoined] = useState(false);
const [userName, setUserName] = useState("");
    const [participantMedia, setParticipantMedia] = useState({});
    const {
      videoRef,
      localStream,
      localStreamRef,
    
      micOn,
      cameraOn,
    
      startCamera,
      stopCamera,
    
      toggleMic,
      toggleCamera
    } = useLocalMedia();


    const {
      remoteStreams,
      createPeerConnection,
      createOffer,
      handleOffer,
      handleAnswer,
      handleIceCandidate,
      removePeer
    } = useWebRTC(localStreamRef);
 
    useSocket({
      enabled: joined,
      roomId,
      userName,
      startCamera,
      stopCamera,
    
      onExistingUsers: async (users) => {

        const media = {};
      
        for (const user of users) {
      
          media[user.userId] = {
            name: user.name,
            micOn: user.micOn,
            cameraOn: user.cameraOn,
          };
      
          createPeerConnection(user.userId);
          await createOffer(user.userId);
        }
      
        setParticipantMedia(media);
      },
    
      onUserJoined: ({ userId, name }) => {

        setParticipantMedia((prev) => ({
          ...prev,
          [userId]: {
            name,
            micOn:true,
            cameraOn:true,
          },
        }));
      
        createPeerConnection(userId);
      },
    
      onOffer: handleOffer,
      onAnswer: handleAnswer,
      onIceCandidate: handleIceCandidate,
      onCameraToggle: ({ userId, cameraOn }) => {
        setParticipantMedia((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            cameraOn,
          },
        }));
      },
      
      onMicToggle: ({ userId, micOn }) => {
        setParticipantMedia((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            micOn,
          },
        }));
      },
      onUserLeft: ({ userId, name }) => {
        removePeer(userId);
      
        toast.warn(`${name} left the meeting`);
      },
    });
   
  const shareScreen = () => {
  
    alert("Coming Soon");
  
  };
  
  const leaveMeeting = () => {
    socket.emit("leave-room", roomId);
  
    stopCamera();
  
    socket.disconnect();
  
    navigate("/", { replace: true });
  };
  const handleJoin = (name) => {
    setUserName(name);
    setJoined(true);
  };
  if (!joined) {
    return (
      <JoinMeeting
        onJoin={handleJoin}
      />
    );
  }

  return (
    <div className="meeting">

      <div className="meeting-header">

        <h3>Meeting ID</h3>

        <p>{roomId}</p>
        <p>{userName}</p>

      </div>

      <div className="video-container">
      <VideoGrid
        localStream={localStream}
        remoteStreams={remoteStreams}
        participantMedia={participantMedia}
        userName={userName}
        localMedia={{
          micOn,
          cameraOn,
        }}
/>

</div>
      {/* </div> */}
      <Controls
  micOn={micOn}
  cameraOn={cameraOn}
  toggleMic={() => toggleMic(roomId)}
  toggleCamera={() => toggleCamera(roomId)}
  shareScreen={shareScreen}
  leaveMeeting={leaveMeeting}
/>

    </div>
  );
}

export default Meeting;