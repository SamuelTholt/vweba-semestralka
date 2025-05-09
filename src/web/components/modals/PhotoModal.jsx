import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { GalleryContext } from "../../contexts/GalleryContext";

Modal.setAppElement("#root"); // aby nevyhadzovalo warningy

const PhotoModal = ({ isOpen, onRequestClose }) => {
    const { user, token  } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { fetchPhotos } = useContext(GalleryContext); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError("");
        setImage(selectedFile);
    };

    const isAdmin = ["admin", "hl.admin"].includes(user?.role);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        if (!isAdmin) {
            setError("Nemáte oprávnenie pridávať položky do menu!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
     

        try {
            const authToken = token;
            await axios.post("http://localhost:5000/gallery/create", formData, {
                headers: {
                "x-access-token": authToken,
                }
            });
            onRequestClose();
            setTitle("");
            setImage("");

            alert("Fotografia úspešne pridaná!");
            window.location.reload();
            fetchPhotos();
        } catch (error) {
            console.error("Chyba pri ukladaní fotografie:", error);
        if (error.response) {
            const data = error.response.data;
            setError(data.errors ? data.errors.map(e => e.msg).join(", ") : data.error || "Neznáma chyba");
        } else {
            setError("Nepodarilo sa uložiť fotografiu. Skontrolujte pripojenie k internetu.");
        }
        } finally {
            setIsSubmitting(false);
        }    
    };

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Pridať fotografiu"
        className="Modal__content"
        overlayClassName="Modal__overlay"
        >
        <div className="Modal__header">
            <h2>Pridať fotografiu</h2>
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
                Titulný popisok: 
            </label>
            <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Napíšte titulok"
                className="Modal__textarea"
            />
            </div>
            <div className="Modal__form-group">
            <label>
                Obrázok
            </label>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="Modal__file-input"
            />
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
                disabled={isSubmitting || error}
            >
                {isSubmitting ? "Odosielam..." : "Odoslať"}
            </button>
            </div>
        </form>
        </Modal>
    );
};

export default PhotoModal;