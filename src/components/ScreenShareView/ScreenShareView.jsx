import "./ScreenShareView.css";
import VideoCard from "../VideoCard/VideoCard";

function ScreenShareView({
  screenStream,
  localStream,
  userName,
  localMedia,
}) {
  return (
    <div className="screen-share-view">

      {/* Shared Screen */}
      <div className="shared-screen">
        <VideoCard
          stream={screenStream}
          muted
          name={`${userName} (Presenting)`}
          cameraOn={true}
          micOn={localMedia.micOn}
          isLocal={true}
        />
      </div>

      {/* Floating Camera */}
      <div className="floating-camera">
        <VideoCard
          stream={localStream}
          muted
          name={userName}
          cameraOn={localMedia.cameraOn}
          micOn={localMedia.micOn}
          isLocal={true}
        />
      </div>

    </div>
  );
}

export default ScreenShareView;