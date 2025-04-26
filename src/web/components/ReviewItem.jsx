import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "./modals/ImageModal";
import EditReviewModal from "./modals/EditReviewModal";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";


const ReviewItem = ({
    _id,
    comment,
    star_rating,
    pridal_user,
    pridal_user_id,
    images,
    createdAt,
    onReviewDeleted
}) => {
    const { user, token } = useContext(AuthContext);
    const [modalImage, setModalImage] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    const handleDeleteReview = async () => {
        if (window.confirm("Skutočne chcete vymazať túto recenziu?")) {
            setIsDeleting(true);
            try {
                await axios.delete(`http://localhost:5000/reviews/delete/${_id}`, {
                    headers: {
                        "x-access-token": token,
                    }
                });
                if (onReviewDeleted) {
                    onReviewDeleted(_id);
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("Nepodarilo sa vymazať recenziu.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const isOwner = user && user.id === pridal_user_id || user.role == "admin";
    return (
        <div className="container review-container">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-10">
                            <p>
                                <strong>{pridal_user}</strong>
                                {Array.from({ length: star_rating }).map((_, index) => (
                                    <span key={index} className="float-right">
                                        <FontAwesomeIcon icon={faStar}/>
                                    </span>
                                ))}
                            </p>
                            <div className="clearfix"></div>
                            <p>{comment}</p>
                            <p>{new Date(createdAt).toLocaleString()}</p>

                            {images && images.length > 0 && (
                                <div className="review-images text-center mt-3">
                                    {images.map((img, idx) => {
                                        const savedImgPath = img || "";
                                        const imageUrl = savedImgPath.replace("public", "");
                                        const imageFullUrl = imageUrl ? `http://localhost:5000${imageUrl}` : "";

                                        return (
                                            <img
                                                key={idx}
                                                src={imageFullUrl}
                                                alt={`Review Image ${idx + 1}`}
                                                className="review-image-thumbnail"
                                                onClick={() => openModal(imageFullUrl)}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {/* Modal na obrázok */}
                            {modalImage && (
                                <ImageModal modalImage={modalImage} closeModal={closeModal} />
                            )}

                            {/* Tlačidlo "Upraviť recenziu" - zobrazí sa len autorovi */}
                            {isOwner && (
                                <div className="mt-3">
                                    <button 
                                        onClick={() => setIsEditModalOpen(true)} 
                                        className="btn btn-primary btn-sm mr-2"
                                        disabled={isDeleting}
                                    >
                                        Upraviť recenziu
                                    </button>
                                    <button 
                                        onClick={handleDeleteReview} 
                                        className="btn btn-danger btn-sm"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Mazanie..." : 
                                        <>
                                            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Vymazať
                                        </>}
                                    </button>

                                    <EditReviewModal
                                        isOpen={isEditModalOpen}
                                        onRequestClose={() => setIsEditModalOpen(false)}
                                        review={{
                                            _id,
                                            comment,
                                            star_rating,
                                            images,
                                            pridal_user,
                                            pridal_user_id,
                                            createdAt,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
