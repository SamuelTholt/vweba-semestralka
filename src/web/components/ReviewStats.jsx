import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/AuthContext";

const ReviewStats = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalReviews: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        averageRating: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewStats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/reviews/stats", {
                headers: {
                    "x-access-token": token,
                }
            });
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching review stats:", err);
            setError("Nepodarilo sa načítať štatistiky recenzií");
            setLoading(false);
        }
        };

    fetchReviewStats();
    }, [token]);

    if (loading) return <div className="text-center whiteColor">Načítavam štatistiky...</div>;
    if (error) return <div className="text-center whiteColor">{error}</div>;

    return (
        <div className="review-stats-container mb-4 p-3 bg-dark rounded">
            <h3 className="text-center mb-3">Hodnotenia</h3>
            
            <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="average-rating me-3">
                <span className="display-4">{stats.averageRating}</span>
                <span className="text-warning ms-2">
                    <FontAwesomeIcon icon={faStar} />
                </span>
                </div>
                <div className="total-reviews">
                <p className="mb-0">z {stats.totalReviews} recenzií</p>
                </div>
            </div>
            
            <div className="rating-bars">
                {[5, 4, 3, 2, 1].map(stars => {
                const count = stats.ratingCounts[stars] || 0;
                const percentage = stats.totalReviews > 0 
                    ? Math.round((count / stats.totalReviews) * 100) 
                    : 0;
                    
                return (
                    <div key={stars} className="rating-bar d-flex align-items-center mb-2">
                    <div className="stars-label me-2" style={{ width: "60px" }}>
                        {stars} <FontAwesomeIcon icon={faStar} className="text-warning" />
                    </div>
                    <div className="progress flex-grow-1" style={{ height: "20px" }}>
                        <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        >
                        {percentage}%
                        </div>
                    </div>
                    <div className="count-label ms-2" style={{ width: "40px", textAlign: "right" }}>
                        ({count})
                    </div>
                    </div>
                );
                })}
            </div>
        </div>
  );
};

export default ReviewStats;