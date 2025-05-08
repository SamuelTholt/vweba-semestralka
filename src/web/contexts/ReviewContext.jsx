import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [showMyReviews, setShowMyReviews] = useState(false);
    const [hasUserReviews, setHasUserReviews] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkUserReviews = useCallback(async () => {
        if (!token) return;
        
        try {
            const response = await axios.get(`http://localhost:5000/reviews/myReviews?page=1&limit=1`, {
                headers: {
                    "x-access-token": token,
                }
            });
            
            setHasUserReviews(response.data.totalPages > 0);
        } catch (error) {
            console.error("Chyba pri kontrole používateľských recenzií:", error);
            setHasUserReviews(false);
        }
    }, [token]);

    const fetchReviews = useCallback(async (page = 1) => {
        if (!token) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const sortQuery = `&sort=${sortOrder}`;
            const endpoint = showMyReviews 
                ? `http://localhost:5000/reviews/myReviews?page=${page}&limit=4${sortQuery}`
                : `http://localhost:5000/reviews?page=${page}&limit=4${sortQuery}`;
    
            const response = await axios.get(endpoint, {
                headers: {
                    "x-access-token": token,
                }
            });
    
            setReviews(response.data.reviews);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Chyba pri načítavaní recenzií:", error);
            setError("Nepodarilo sa načítať recenzie");
        } finally {
            setIsLoading(false);
        }
    }, [token, sortOrder, showMyReviews]);

    const deleteReview = useCallback(async (reviewId) => {
        if (!token) return;
        
        if (window.confirm("Skutočne chcete vymazať túto recenziu?")) {
            try {
                await axios.delete(`http://localhost:5000/reviews/delete/${reviewId}`, {
                    headers: {
                        "x-access-token": token,
                    }
                });
                
                setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
                return true;
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("Nepodarilo sa vymazať recenziu.");
                return false;
            }
        }
        return false;
    }, [token]);

    const isReviewOwner = useCallback((reviewUserId) => {
        return user && (user.id === reviewUserId || user.role === "admin");
    }, [user]);

    const changePage = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        fetchReviews(pageNumber);
    }, [fetchReviews]);

    const toggleSortOrder = useCallback(() => {
        setSortOrder(prev => {
            const newOrder = prev === "asc" ? "desc" : "asc";
            return newOrder;
        });
    }, []);

    const toggleShowMyReviews = useCallback(() => {
        setShowMyReviews(prev => !prev);
        setCurrentPage(1);
    }, []);

    return (
        <ReviewContext.Provider 
            value={{
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
                deleteReview,
                isReviewOwner,
                changePage,
                toggleSortOrder,
                toggleShowMyReviews
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviewContext = () => useContext(ReviewContext);