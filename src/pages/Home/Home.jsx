import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMeetingId } from "../../utils/generateMeetingId";
import "./Home.css";
import MeetingLinkModal from "../../components/MeetingLinkModal/MeetingLinkModal";
function Home() {
  const navigate = useNavigate();

  const [meetingId, setMeetingId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

   const [showModal, setShowModal] = useState(false);

   const [roomId, setRoomId] = useState("");

   const createMeeting = () => {
     const id = generateMeetingId();
   
     setRoomId(id);
   
     const link = `${window.location.origin}/meeting/${id}`;
   
     setMeetingLink(link);
   
     setShowModal(true);
   };

  const joinMeeting = () => {
    if (!meetingId.trim()) return;
  
    let roomId = meetingId.trim();
  
    // Agar user ne pura URL paste kiya hai
    if (roomId.includes("/meeting/")) {
      roomId = roomId.split("/meeting/")[1];
    }
  
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div className="home">
  
      <h1>Google Meet Clone</h1>
  
      <button onClick={createMeeting}>
        New Meeting
      </button>
  
      <div className="join-box">
  
        <input
          placeholder="Enter Meeting Link or ID"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
        />
  
        <button onClick={joinMeeting}>
          Join
        </button>
  
      </div>
  
      {/* Meeting Link Popup */}
      <MeetingLinkModal
    isOpen={showModal}
    meetingLink={meetingLink}
    onClose={() => setShowModal(false)}
    onStartMeeting={() => {
        navigate(`/meeting/${roomId}`);
    }}
/>
  
    </div>
  );
}

export default Home;