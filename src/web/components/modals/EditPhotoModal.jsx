import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { GalleryContext } from "../../contexts/GalleryContext";

Modal.setAppElement("#root");

const EditPhotoModal = ({ isOpen, onRequestClose, photoItem }) => {
    const { user, token } = useContext(AuthContext);
    const { fetchPhotos } = useContext(GalleryContext); 
    const [formData, setFormData] = useState({
        title: "",
        numberOrder: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [error, setError] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [replaceImage, setReplaceImage] = useState(false);

    useEffect(() => {
        if (photoItem) {
            setFormData({
                title: photoItem.title || "",
                numberOrder: photoItem.numberOrder || 0,
            });
            setCurrentImage(photoItem.imageLocation || "");
        }
    }, [photoItem]);

    const isAdmin = ["admin", "hl.admin"].includes(user?.role);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
            setReplaceImage(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            setError("Nemáte oprávnenie upravovať fotografie!");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const formSubmitData = new FormData();
            formSubmitData.append("title", formData.title);
            formSubmitData.append("numberOrder", formData.numberOrder);
            
            if (replaceImage && newImage) {
                formSubmitData.append("image", newImage);
            }
            
            const response = await axios.put(
                `http://localhost:5000/gallery/edit/${photoItem._id}`,
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
                alert("Fotografia úspešne upravená!");
                window.location.reload();
                fetchPhotos();
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update photo");
        } finally {
            setIsSubmitting(false);
        }
    }; 

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit fotografie"
            className="Modal__content"
            overlayClassName="Modal__overlay"
        >
            <div className="Modal__header">
                <h5>Upraviť fotografiu</h5>
                <button type="button" className="Modal__close-button" onClick={onRequestClose}>
                    &times;
                </button>
            </div>
            
            {error && <div className="Modal__error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="Modal__form-group">
                    <label htmlFor="title">Titulný popisok: </label>
                    <textarea
                        className="Modal__textarea"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="Modal__form-group">
                    <label htmlFor="numberOrder">Poradové číslo: </label>
                    <input
                        type="number"
                        className="Modal__input"
                        id="numberOrder"
                        name="numberOrder"
                        value={formData.numberOrder}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                {currentImage && (
                    <div className="Modal__form-group">
                        <label>Aktuálny obrázok</label>
                        <div className="existing-image">
                            <img
                                src={`http://localhost:5000${currentImage.replace("public", "")}`}
                                alt="Aktuálny obrázok"
                                style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>
                    </div>
                )}
                
                <div className="Modal__form-group">
                    <label htmlFor="newImage">Nahradiť obrázok</label>
                    <input
                        type="file"
                        className="Modal__file-input"
                        id="newImage"
                        name="newImage"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {replaceImage && newImage && (
                        <div className="Modal__file-info">
                            Nový obrázok: {newImage.name}
                        </div>
                    )}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Upravujem..." : "Uložiť zmeny"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditPhotoModal;