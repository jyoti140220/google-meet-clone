import { useRef, useState } from "react";import socket from "../services/socket";

function useWebRTC(localStreamRef, screenTrackRef,isScreenSharingRef) {
  // Store one RTCPeerConnection per remote user
  const peerConnections = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const createPeerConnection = (userId) => {
    // Already exists
    if (peerConnections.current[userId]) {
      return peerConnections.current[userId];
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    peer.onicecandidate = (event) => {
        if (!event.candidate) return;
      
        socket.emit("ice-candidate", {
          targetId: userId,
          candidate: event.candidate,
        });
      
        console.log("ICE Sent:", userId);
      };
      peer.ontrack = (event) => {
        console.log("Remote Track Received:", userId);
        console.log(
          "REMOTE TRACK:",
          event.track.kind,
          event.track.label
        );
      
        console.log(
          "REMOTE STREAM:",
          event.streams[0]
        );
      
        setRemoteStreams((prev) => ({
          ...prev,
          [userId]: event.streams[0],
        }));
      };

    // Add local tracks
    // if (localStreamRef.current) {
    //   localStreamRef.current.getTracks().forEach((track) => {
    //     peer.addTrack(track, localStreamRef.current);
    //   });
    // }

    // Add local tracks
// Add local tracks
if (localStreamRef.current) {

  // Agar presenter screen share kar raha hai
  if (
    isScreenSharingRef.current &&
    screenTrackRef.current
  ) {

    // Screen video
    peer.addTrack(
      screenTrackRef.current,
      new MediaStream([screenTrackRef.current])
    );

    // Mic audio
    const audioTrack =
      localStreamRef.current.getAudioTracks()[0];

    if (audioTrack) {
      peer.addTrack(
        audioTrack,
        localStreamRef.current
      );
    }

  } else {

    // Camera + Mic
    localStreamRef.current
      .getTracks()
      .forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });

  }
}

    peerConnections.current[userId] = peer;

    console.log("Peer Created:", userId);

    return peer;
  };
  const createOffer = async (userId) => {
    const peer = peerConnections.current[userId];
  
    if (!peer) return;
  
    const offer = await peer.createOffer();
  
    await peer.setLocalDescription(offer);
  
    socket.emit("offer", {
      targetId: userId,
      offer,
    });
  
    console.log("Offer Sent To:", userId);
  };
  const handleOffer = async ({ from, offer }) => {
    console.log("Offer Received From:", from);
  
    let peer = peerConnections.current[from];
  
    if (!peer) {
      peer = createPeerConnection(from);
    }
  
    await peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
  
    // Create Answer
    const answer = await peer.createAnswer();
  
    await peer.setLocalDescription(answer);
  
    socket.emit("answer", {
      targetId: from,
      answer,
    });
  
    console.log("Answer Sent To:", from);
  };
  const handleAnswer = async ({ from, answer }) => {
    console.log("Answer Received From:", from);
  
    const peer = peerConnections.current[from];
  
    if (!peer) return;
  
    await peer.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };
  const handleIceCandidate = async ({ from, candidate }) => {
    console.log("ICE Received From:", from);
  
    const peer = peerConnections.current[from];
  
    if (!peer) return;
  
    try {
      await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
  
      console.log("ICE Added");
    } catch (err) {
      console.error(err);
    }
  };
  const replaceVideoTrack = (newTrack) => {

    console.log(
      "Replacing Track:",
      newTrack
    );  
    Object.values(peerConnections.current).forEach((peer) => {
  
      const sender = peer
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");
  
      console.log("VIDEO SENDER:", sender);
  
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  };
  // const replaceVideoTrack = (newTrack) => {
  //   Object.values(peerConnections.current).forEach((peer) => {
  //     const sender = peer
  //       .getSenders()
  //       .find((s) => s.track && s.track.kind === "video");
  
  //     if (sender) {
  //       sender.replaceTrack(newTrack);
  //     }
  //   });
  // };
  const removePeer = (userId) => {
    const peer = peerConnections.current[userId];
  
    if (peer) {
      peer.close();
      delete peerConnections.current[userId];
    }
  
    setRemoteStreams((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  
    console.log("Peer Removed:", userId);
  };

  return {
    peerConnections,
    remoteStreams,
    createPeerConnection,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    replaceVideoTrack,
    removePeer
  };
}

export default useWebRTC;