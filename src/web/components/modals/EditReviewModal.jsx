import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useReviewContext } from "../../contexts/ReviewContext";

Modal.setAppElement("#root");

const EditReviewModal = ({ isOpen, onRequestClose, review }) => {
    const { token } = useContext(AuthContext);
    const { fetchReviews, currentPage } = useReviewContext();
    const [formData, setFormData] = useState({
        comment: "",
        star_rating: 0,
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (review) {
            setFormData({
                comment: review.comment || "",
                star_rating: review.star_rating || 0,
            });
            setExistingImages(review.images || []);
        }
    }, [review]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const toggleImageDelete = (imagePath) => {
        if (imagesToDelete.includes(imagePath)) {
            setImagesToDelete(imagesToDelete.filter(path => path !== imagePath));
        } else {
            setImagesToDelete([...imagesToDelete, imagePath]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const formSubmitData = new FormData();
            formSubmitData.append("comment", formData.comment);
            formSubmitData.append("star_rating", formData.star_rating);
            
            newImages.forEach((image) => {
                formSubmitData.append("images", image);
            });
            
            imagesToDelete.forEach((image) => {
                formSubmitData.append("imagesToDelete", image);
            });

            const response = await axios.put(
                `http://localhost:5000/reviews/edit/${review._id}`,
                formSubmitData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-access-token": token
                    },
                }
            );

            if (response.status === 200) {
                onRequestClose();
                alert("Recenzia úspešne upravená!");
                fetchReviews(currentPage);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit recenzie"
            className="Modal__content"
            overlayClassName="Modal__overlay"
        >
            <div className="Modal__header">
                <h5>Upraviť recenziu</h5>
                <button type="button" className="Modal__close-button" onClick={onRequestClose}>
                    &times;
                </button>
            </div>
            
            {error && <div className="Modal__error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="Modal__form-group">
                    <label>Hodnotenie <span className="required">*</span></label>
                    <select
                        className="Modal__select"
                        name="star_rating"
                        value={formData.star_rating}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Vyberte hodnotenie --</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {star} {star === 1 ? "hviezdička" : star < 5 ? "hviezdičky" : "hviezdičiek"}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="Modal__form-group">
                    <label htmlFor="comment">Komentár <span className="required">*</span></label>
                    <textarea
                        className="Modal__textarea"
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>
                
                {existingImages.length > 0 && (
                    <div className="Modal__form-group">
                        <label>Aktuálne obrázky</label>
                        <div className="existing-images">
                            {existingImages.map((img, idx) => {
                                const savedImgPath = img || "";
                                const imageUrl = savedImgPath.replace("public", "");
                                const imageFullUrl = imageUrl ? `http://localhost:5000${imageUrl}` : "";
                                const isMarkedForDeletion = imagesToDelete.includes(img);

                                return (
                                    <div key={idx} className="existing-image-container" style={{ 
                                        display: 'inline-block', 
                                        margin: '5px', 
                                        textAlign: 'center',
                                        opacity: isMarkedForDeletion ? 0.5 : 1 
                                    }}>
                                        <img
                                            src={imageFullUrl}
                                            alt={`Review Image ${idx + 1}`}
                                            style={{ 
                                                maxWidth: '100px', 
                                                maxHeight: '100px',
                                                border: isMarkedForDeletion ? '2px solid red' : '1px solid #ddd'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={`Modal__button ${isMarkedForDeletion ? 'Modal__button--submit' : 'Modal__button--cancel'}`}
                                            style={{ display: 'block', width: '100%', marginTop: '5px', fontSize: '0.8rem', padding: '3px' }}
                                            onClick={() => toggleImageDelete(img)}
                                        >
                                            {isMarkedForDeletion ? 'Ponechať' : 'Vymazať'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <div className="Modal__form-group">
                    <label htmlFor="newImages">Pridať nové obrázky</label>
                    <input
                        type="file"
                        className="Modal__file-input"
                        id="newImages"
                        name="newImages"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                    />
                    <div className="Modal__file-count">
                        Môžete nahrať maximálne 5 súborov (vrátane existujúcich). Aktuálne: {(existingImages.length - imagesToDelete.length) + newImages.length}/5
                    </div>
                </div>
                
                <div className="Modal__buttons">
                    <button
                        type="button"
                        className="Modal__button Modal__button--cancel"
                        onClick={onRequestClose}
                    >
                        Zrušiť
                    </button>
                    <button
                        type="submit"
                        className="Modal__button Modal__button--submit"
                        disabled={isSubmitting || (existingImages.length - imagesToDelete.length) + newImages.length > 5}
                    >
                        {isSubmitting ? "Upravujem..." : "Uložiť zmeny"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditReviewModal;