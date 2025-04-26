import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ImageModal = ({ modalImage, closeModal }) => {
  if (!modalImage) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <img src={modalImage} alt="Full Size" className="modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;
