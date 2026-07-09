import { useState } from "react";
import "./JoinMeeting.css";

function JoinMeeting({ onJoin }) {
  const [name, setName] = useState("");

  return (
    <div className="join-screen">

      <div className="join-card">

        <h2>Join Meeting</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={!name.trim()}
          onClick={() => onJoin(name)}
        >
          Join Now
        </button>

      </div>

    </div>
  );
}

export default JoinMeeting;