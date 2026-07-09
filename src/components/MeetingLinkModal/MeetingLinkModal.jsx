import { useState } from "react";
import { FaCopy, FaCheck, FaTimes } from "react-icons/fa";
import "./MeetingLinkModal.css";

function MeetingLinkModal({
  isOpen,
  meetingLink,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const meetingId = meetingLink.split("/").pop();

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Joining info</h2>

          <FaTimes
            className="close-icon"
            onClick={onClose}
          />
        </div>

        <p className="modal-text">
          Share this meeting link with others
        </p>

        <h4 className="section-title">
          Meeting link
        </h4>

        <div className="link-box">
          <span>{meetingLink}</span>

          <button
            className="copy-btn"
            onClick={copyLink}
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>

        <h4 className="section-title">
          Meeting ID
        </h4>

        <div className="meeting-id">
          {meetingId}
        </div>

      </div>
    </div>
  );
}

export default MeetingLinkModal;