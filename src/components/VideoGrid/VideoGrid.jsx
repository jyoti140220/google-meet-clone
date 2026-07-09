import "./VideoGrid.css";
import VideoCard from "../VideoCard/VideoCard";

function VideoGrid({
    localStream,
    remoteStreams,
    participantMedia,
    userName,
    localMedia,
}) {
    console.log("VideoGrid Render:", localStream);


  const remoteUsers = Object.entries(remoteStreams);

  const totalVideos = 1 + remoteUsers.length;

  return (
    <div
      className={`video-grid ${
        totalVideos === 1
          ? "one-user"
          : totalVideos === 2
          ? "two-users"
          : "multi-users"
      }`}
    >

      {/* Local Video */}

      <VideoCard
        stream={localStream}
        muted={true}
        name={userName}
        isLocal={true}
        micOn={localMedia.micOn}
        cameraOn={localMedia.cameraOn}
    />

      {/* Remote Users */}

      {remoteUsers.map(([userId, stream]) => (
        <VideoCard
            key={userId}
            stream={stream}
            name={participantMedia[userId]?.name || "Guest"}            micOn={participantMedia[userId]?.micOn ?? true}
            cameraOn={participantMedia[userId]?.cameraOn ?? true}
            />
        ))}
    </div>
  );
}

export default VideoGrid;