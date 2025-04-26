import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "./modals/ImageModal";

const ReviewItem = ({
    _id,
    comment,
    star_rating,
    pridal_user,
    pridal_user_id,
    images,
    createdAt,
}) => {
    console.log(_id, pridal_user_id);
    const [modalImage, setModalImage] = useState(null);

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
    };

    const closeModal = () => {
        setModalImage(null);
    };

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

                            {/* Modal */}
                            {modalImage && (
                                <ImageModal modalImage={modalImage} closeModal={closeModal} />
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;