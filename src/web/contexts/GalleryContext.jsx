import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useCallback } from "react";

export const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [photosPerPage] = useState(8);
    const { user, token } = useContext(AuthContext);
    
    const isAdmin = useCallback(() => {
        return user && user.role === "admin";
    }, [user]);

    const fetchPhotos = useCallback(async (page) => {
        setLoading(true);
        try {
        const response = await axios.get(
            `http://localhost:5000/gallery?page=${page}&limit=${photosPerPage}`
        );
        setPhotos(response.data.photos);
        setTotalPages(response.data.totalPages);
        setLoading(false);
        } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
        }
    }, [photosPerPage]);
    
    useEffect(() => {
        fetchPhotos(currentPage);
    }, [currentPage, fetchPhotos]);

    const openModal = useCallback((imageUrl, e) => {
        if (e) {
        e.stopPropagation();
        }

        // Format image path
        const formattedImageUrl = imageUrl
        ? `http://localhost:5000/${imageUrl.replace(/^public\\/, "").replace(/\\/g, "/")}`
        : "";

        setModalImage(formattedImageUrl);
    }, []);

    const closeModal = useCallback(() => {
        setModalImage(null);
    }, []);

    const openEditModal = useCallback((photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo);
        setEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setEditModalOpen(false);
        setSelectedPhoto(null);
        fetchPhotos(currentPage);
    }, [fetchPhotos, currentPage]);

    const handleDeletePhoto = useCallback(async (photoId, e) => {
        e.stopPropagation();
        if (window.confirm("Naozaj chcete odstrániť túto fotografiu?")) {
        try {
            await axios.delete(`http://localhost:5000/gallery/delete/${photoId}`, {
            headers: {
                "x-access-token": token,
            },
            });
            alert("Fotografia bola úspešne odstránená!");

            if (photos.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
            } else {
            fetchPhotos(currentPage);
            }
        } catch (err) {
            alert(err.response?.data?.error || "Chyba pri odstraňovaní fotografie");
        }
        }
    }, [token, photos.length, currentPage, fetchPhotos]);

    const paginate = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const formatImageUrl = useCallback((savedImgPath) => {
        const imageUrl = (savedImgPath || "").replace(/^public\\/, "").replace(/\\/g, "/");
        return imageUrl ? `http://localhost:5000/${imageUrl}` : "";
    }, []);
    
    return (
        <GalleryContext.Provider 
            value={{
                photos,
                loading,
                error,
                modalImage,
                editModalOpen,
                selectedPhoto,
                currentPage,
                totalPages,
                openModal,
                closeModal,
                openEditModal,
                closeEditModal,
                handleDeletePhoto,
                paginate,
                formatImageUrl,
                fetchPhotos,
                isAdmin
            }}
        >
            {children}
        </GalleryContext.Provider>
    );
};

export default GalleryProvider;