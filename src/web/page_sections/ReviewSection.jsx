import React, { useContext, useEffect } from "react";
import ReviewItem from "../components/ReviewItem";
import { AuthContext } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ReviewStats from "../components/ReviewStats";
import { useReviewContext } from "../contexts/ReviewContext";


const ReviewSection = () => {
    const { token } = useContext(AuthContext);
    const { 
        reviews, 
        currentPage, 
        totalPages, 
        sortOrder, 
        showMyReviews, 
        hasUserReviews,
        isLoading,
        error,
        fetchReviews, 
        checkUserReviews, 
        changePage,
        toggleSortOrder, 
        toggleShowMyReviews 
    } = useReviewContext();

    useEffect(() => {
        if (token) {
            fetchReviews(currentPage);
            checkUserReviews();
        }
    }, [fetchReviews, checkUserReviews, currentPage, token]);

    const handlePageClick = (pageNumber) => {
        changePage(pageNumber);
    };

    if (isLoading && reviews.length === 0) {
        return (
            <div className="whiteColor text-center">
                <h2 className="mb-4">Napísali o nás</h2>
                <p>Načítavam recenzie...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="whiteColor text-center">
                <h2 className="mb-4">Napísali o nás</h2>
                <p>Nastala chyba: {error}</p>
            </div>
        );
    }

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return (
            <div className="whiteColor text-center">
                <h2 className="mb-4">Napísali o nás</h2>
                <p>Žiadne recenzie zatiaľ nie sú.</p>
            </div>
        );
    }

    return (
        <section className="py-5">
            <div className="container my-5 whiteColor">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <ReviewStats />
                        <h2 className="text-center mb-4">Napísali o nás</h2>
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            <button className="btn btn-secondary" onClick={toggleSortOrder}>
                                {sortOrder === "asc" ? "Najstaršie prvé" : "Najnovšie prvé"}
                            </button>

                            {token && hasUserReviews && (
                                <button className="btn btn-info" onClick={toggleShowMyReviews}>
                                    {showMyReviews ? "Zobraziť všetky recenzie" : "Zobraziť moje recenzie"}
                                </button>
                            )}
                        </div>

                        <div className="reviews-container">
                            {reviews.map((item) => (
                                <ReviewItem
                                    key={item._id}
                                    _id={item._id}
                                    comment={item.comment}
                                    star_rating={item.star_rating}
                                    pridal_user={item.pridal_user}
                                    pridal_user_id={item.pridal_user_id}
                                    images={item.images}
                                    createdAt={item.createdAt}
                                />
                            ))}
                        </div>

                        {/* Ovládanie stránkovania */}
                        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
                            <button type="button" className="btn btn-primary" 
                                onClick={() => changePage(Math.max(currentPage - 1, 1))} 
                                disabled={currentPage === 1 || isLoading}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} style={{color: "#ffffff"}} />
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageClick(index + 1)}
                                    style={{
                                        fontWeight: currentPage === index + 1 ? "bold" : "normal",
                                        textDecoration: currentPage === index + 1 ? "underline" : "none",
                                        padding: "5px 10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        backgroundColor: currentPage === index + 1 ? "green" : "black",
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button type="button" className="btn btn-primary" 
                                onClick={() => changePage(Math.min(currentPage + 1, totalPages))} 
                                disabled={currentPage === totalPages || isLoading}
                            >
                                <FontAwesomeIcon icon={faArrowRight} style={{color: "#ffffff"}} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;