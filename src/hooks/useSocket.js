import { useEffect } from "react";
import socket from "../services/socket";

function useSocket({
    enabled,
    roomId,
    userName,
    startCamera,
    stopCamera,
    onExistingUsers,
    onUserJoined,
    onOffer,
    onAnswer,
    onIceCandidate,
    onCameraToggle,
    onMicToggle,
    onUserLeft
}) {
  useEffect(() => {
    if (!enabled) return;

    const initMeeting = async () => {
      // Camera first
      await startCamera();

      // Connect socket
      socket.connect();

      console.log("Connecting Socket...");

      socket.on("connect", () => {
        console.log("Socket Connected:", socket.id);

        socket.emit("join-room", {
            roomId,
            name: userName,
          });

        console.log("Joined Room:", roomId, "user ", userName);
      });

      socket.on("existing-users", (users) => {
        console.log("Existing Users:", users);

        onExistingUsers(users);
      });

      socket.on("user-joined", (user) => {
        console.log("New User Joined:", user);
      
        onUserJoined(user);
      });
      socket.on("offer", (data) => {
        onOffer(data);
      });
      socket.on("answer", (data) => {
        onAnswer(data);
      });
      socket.on("ice-candidate", (data) => {
        onIceCandidate(data);
      });
      socket.on("camera-toggle", (data) => {
        console.log("Remote Camera Event:", data);
        onCameraToggle(data);
    });
    
    socket.on("mic-toggle", (data) => {
        console.log("Remote Mic Event:", data);
        onMicToggle(data);
    });
    socket.on("user-left", (user) => {
        console.log("User Left:", user);
      
        onUserLeft(user);
      });
    };

    initMeeting();

    return () => {
        stopCamera();
      
        socket.off("connect");
        socket.off("existing-users");
        socket.off("user-joined");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("camera-toggle");
        socket.off("mic-toggle");
        socket.off("user-left");
      
        socket.disconnect();
      };
  }, [enabled, roomId, userName]);
}

export default useSocket;