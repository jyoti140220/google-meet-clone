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
// import ScreenShareView from "../../components/ScreenShareView/ScreenShareView";

function Meeting() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [joined, setJoined] = useState(false);
    const [userName, setUserName] = useState("");
    const [participantMedia, setParticipantMedia] = useState({});
    const [screenShare, setScreenShare] = useState({
      isSharing: false,
      presenterId: null,
      presenterName: "",
    });
    const {
      videoRef,
      localStream,
      localStreamRef,
    
      micOn,
      cameraOn,
    
      startCamera,
      stopCamera,
    
      toggleMic,
      toggleCamera,
      screenStream,
      isScreenSharing,
      isScreenSharingRef,
      startScreenShare,
      stopScreenShare,
      screenTrackRef,
    } = useLocalMedia();


    const {
      remoteStreams,
      createPeerConnection,
      createOffer,
      handleOffer,
      handleAnswer,
      handleIceCandidate,
      replaceVideoTrack,
      removePeer
    } = useWebRTC(localStreamRef, screenTrackRef,
      isScreenSharingRef);
 
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
      onRoomState: (room) => {
        setScreenShare({
          isSharing: room?.isScreenSharing ?? false,
          presenterId: room?.presenterId ?? null,
          presenterName: room?.presenterName ?? "",
        });
      },
      
      onScreenShareStarted: (data) => {
        setScreenShare({
          isSharing: true,
          presenterId: data.presenterId,
          presenterName: data.presenterName,
        });
      },
      
      onScreenShareStopped: () => {
        setScreenShare({
          isSharing: false,
          presenterId: null,
          presenterName: "",
        });
      },
      onUserLeft: ({ userId, name }) => {
        removePeer(userId);
      
        toast.warn(`${name} left the meeting`);
      },
    });
   
    const shareScreen = async () => {
     
      // Already sharing
      if (isScreenSharing) {
        socket.emit("screen-share-stop", { roomId });
    
        stopScreenShare();
    
        const cameraTrack =
          localStreamRef.current?.getVideoTracks()[0];
    
        if (cameraTrack) {
          replaceVideoTrack(cameraTrack);
        }
    
        return;
      }
    
      // Start sharing
      const screenTrack = await startScreenShare();
      console.log("SCREEN TRACK0:", screenTrack);
      console.log("CAMERA TRACK0:", localStreamRef.current?.getVideoTracks()[0]);
    
      if (!screenTrack) return;
      console.log("SCREEN TRACK:", screenTrack);
      console.log(
        "CAMERA TRACK:",
        localStreamRef.current?.getVideoTracks()[0]
      );
      // 👇 Screen sab peers ko bhejo
      replaceVideoTrack(screenTrack);
    
      socket.emit("screen-share-start", { roomId });
    
      // Browser stop button
      screenTrack.onended = () => {
        const cameraTrack =
          localStreamRef.current?.getVideoTracks()[0];
    
        if (cameraTrack) {
          replaceVideoTrack(cameraTrack);
        }
    
        socket.emit("screen-share-stop", { roomId });
    
        stopScreenShare();
      };
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
      {isScreenSharing && (
  <div className="presenting-banner">
    You are presenting
  </div>
)}

      <div className="video-container">
      <VideoGrid
        localStream={localStream}
        screenStream={screenStream}
        isScreenSharing={isScreenSharing}
        remoteStreams={remoteStreams}
        participantMedia={participantMedia}
        userName={userName}
        localMedia={{
          micOn,
          cameraOn,
        }}
        screenShare={screenShare}

/>

</div>
      {/* </div> */}
      <Controls
  micOn={micOn}
  cameraOn={cameraOn}
  toggleMic={() => toggleMic(roomId)}
  toggleCamera={() => toggleCamera(roomId)}
  isSharing={isScreenSharing}
  shareScreen={shareScreen}
  leaveMeeting={leaveMeeting}
/>

    </div>
  );
}

export default Meeting;