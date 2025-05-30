import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { useReviewContext } from "../../contexts/ReviewContext";

Modal.setAppElement("#root"); // aby nevyhadzovalo warningy

const ReviewModal = ({ isOpen, onRequestClose }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const { fetchReviews, currentPage } = useReviewContext();
  const [comment, setComment] = useState("");
  const [starRating, setStarRating] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 5) {
      setError("Môžete nahrať maximálne 5 obrázkov.");
      setImages(selectedFiles.slice(0, 5));
      return;
    }
  
    setError("");
    setImages(selectedFiles);
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
      const authToken = token;
      await axios.post("http://localhost:5000/reviews/create", formData, {
        headers: {
          "x-access-token": authToken,
        }
      });
      onRequestClose();
      setComment("");
      setStarRating(1);
      setImages([]);

      alert("Recenzia úspešne pridaná!");
      window.location.reload();
      fetchReviews(currentPage);

    } catch (error) {
      console.error("Chyba pri ukladaní recenzie:", error);
      if (error.response) {
        const data = error.response.data;
        setError(data.errors ? data.errors.map(e => e.msg).join(", ") : data.error || "Neznáma chyba");
      } else {
        setError("Nepodarilo sa uložiť recenziu. Skontrolujte pripojenie k internetu.");
      }
    } finally {
      setIsSubmitting(false);
    }    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Pridať recenziu"
      className="Modal__content"
      overlayClassName="Modal__overlay"
    >
      <div className="Modal__header">
        <h2>Pridať recenziu</h2>
        <button 
          onClick={onRequestClose}
          className="Modal__close-button"
        >
          &times;
        </button>
      </div>

      {error && (
        <div className="Modal__error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="Modal__form-group">
          <label>
            Komentár <span className="required">*</span>
          </label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napíšte svoj komentár..."
            className="Modal__textarea"
          />
        </div>

        <div className="Modal__form-group">
          <label>
            Hodnotenie <span className="required">*</span>
          </label>
          <select
            value={starRating}
            onChange={(e) => setStarRating(Number(e.target.value))}
            required
            className="Modal__select"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} {star === 1 ? "hviezdička" : star < 5 ? "hviezdičky" : "hviezdičiek"}
              </option>
            ))}
          </select>
        </div>

        <div className="Modal__form-group">
          <label>
            Obrázky (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="Modal__file-input"
          />
          {images.length > 0 && (
            <div className="Modal__file-count">
              Vybraté súbory: {images.length}
            </div>
          )}
        </div>

        <div className="Modal__buttons">
          <button 
            type="button" 
            onClick={onRequestClose}
            className="Modal__button Modal__button--cancel"
            disabled={isSubmitting}
          >
            Zrušiť
          </button>
          <button 
            type="submit"
            className="Modal__button Modal__button--submit"
            disabled={isSubmitting || images.length > 5 || error}
          >
            {isSubmitting ? "Odosielam..." : "Odoslať"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;