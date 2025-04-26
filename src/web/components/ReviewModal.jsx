import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { AuthContext } from "../contexts/AuthContext";

Modal.setAppElement("#root"); // aby nevyhadzovalo warningy

const ReviewModal = ({ isOpen, onRequestClose }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [starRating, setStarRating] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");


    if (!isAuthenticated) {
      setError("Musíte byť prihlásení na pridanie recenzie.");
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("star_rating", starRating);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await fetch("http://localhost:5000/reviews/create", {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Recenzia úspešne uložená:", data);
        onRequestClose();
        setComment("");
        setStarRating(1);
        setImages([]);
      } else {
        console.error("Chyba pri ukladaní recenzie:", data);
        setError(data.errors ? data.errors.map(e => e.msg).join(", ") : data.error || "Neznáma chyba");
      }
    } catch (error) {
      console.error("Chyba pri komunikácii so serverom:", error);
      setError("Nepodarilo sa uložiť recenziu. Skontrolujte pripojenie k internetu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Pridať recenziu"
      className="ReviewModal__content"
      overlayClassName="ReviewModal__overlay"
    >
      <div className="ReviewModal__header">
        <h2>Pridať recenziu</h2>
        <button 
          onClick={onRequestClose}
          className="ReviewModal__close-button"
        >
          &times;
        </button>
      </div>

      {error && (
        <div className="ReviewModal__error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="ReviewModal__form-group">
          <label>
            Komentár <span className="required">*</span>
          </label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napíšte svoj komentár..."
            className="ReviewModal__textarea"
          />
        </div>

        <div className="ReviewModal__form-group">
          <label>
            Hodnotenie <span className="required">*</span>
          </label>
          <select
            value={starRating}
            onChange={(e) => setStarRating(Number(e.target.value))}
            required
            className="ReviewModal__select"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} {star === 1 ? "hviezdička" : star < 5 ? "hviezdičky" : "hviezdičiek"}
              </option>
            ))}
          </select>
        </div>

        <div className="ReviewModal__form-group">
          <label>
            Obrázky (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="ReviewModal__file-input"
          />
          {images.length > 0 && (
            <div className="ReviewModal__file-count">
              Vybraté súbory: {images.length}
            </div>
          )}
        </div>

        <div className="ReviewModal__buttons">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="ReviewModal__button ReviewModal__button--cancel"
            disabled={isSubmitting}
          >
            Zrušiť
          </button>
          <button 
            type="submit"
            className="ReviewModal__button ReviewModal__button--submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Odosielam..." : "Odoslať"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;