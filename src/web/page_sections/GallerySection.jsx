import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ImageModal from "../components/modals/ImageModal";
import { AuthContext } from "../contexts/AuthContext";
import EditPhotoModal from "../components/modals/EditPhotoModal";

const GallerySection = () => {
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

    useEffect(() => {
        fetchPhotos(currentPage);
    }, [currentPage]);

    const fetchPhotos = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/gallery?page=${page}&limit=${photosPerPage}`);
            setPhotos(response.data.photos);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setLoading(false);
        }
    };

    const openModal = (imageUrl, e) => {
        if (e) {
            e.stopPropagation();
        }
        
        // Upravená cesta k obrázku
        const formattedImageUrl = imageUrl ? 
            `http://localhost:5000/${imageUrl.replace(/^public\\/, '').replace(/\\/g, '/')}` : 
            '';
            
        setModalImage(formattedImageUrl);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    const openEditModal = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedPhoto(null);
        fetchPhotos(currentPage);
    };

    const handleDeletePhoto = async (photoId, e) => {
        e.stopPropagation();
        if (window.confirm("Naozaj chcete odstrániť túto fotografiu?")) {
            try {
                await axios.delete(`http://localhost:5000/gallery/delete/${photoId}`, {
                    headers: {
                        "x-access-token": token
                    }
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
    };

    // Zmena stránky
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="text-center whiteColor">
            Chyba pri načítavaní galérie!
        </div>
        );
    }

    const isAdmin = user?.role === "admin";

    return (
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    {photos.length === 0 ? (
                        <div className="col-12 text-center">
                            <p>Žiadne fotografie na zobrazenie.</p>
                        </div>
                    ) : (
                        photos.map((photo) => (
                            <div key={photo._id} className="col-md-3 mb-4 gallery-item" onClick={(e) => openModal(photo.imageLocation, e)}>
                                <div className="card ms-auto position-relative">
                                    <img 
                                        src={(() => {
                                            const savedImgPath = photo.imageLocation || "";
                                            const imageUrl = savedImgPath.replace(/^public\\/, '').replace(/\\/g, '/');
                                            return imageUrl ? `http://localhost:5000/${imageUrl}` : "";
                                        })()}
                                        alt={photo.title || "Gallery image"}
                                        className="card-img-top"
                                    />
                                    
                                    {photo.title && (
                                        <div className="card-body">
                                            <p className="card-text text-center">{photo.title}</p>
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <div className="position-absolute top-0 end-0 p-2 d-flex">
                                            <button 
                                                className="btn btn-sm btn-info me-1" 
                                                onClick={(e) => openEditModal(photo, e)}
                                                title="Upraviť"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger" 
                                                onClick={(e) => handleDeletePhoto(photo._id, e)}
                                                title="Odstrániť"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stránkovanie */}
                {totalPages > 1 && (
                    <div className="row mt-4">
                        <div className="col-12">
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            &laquo;
                                        </button>
                                    </li>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => paginate(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Modal na obrázok */}
                {modalImage && (
                    <ImageModal modalImage={modalImage} closeModal={closeModal} />
                )}

                {/* Modal na úpravu fotky */}
                {editModalOpen && selectedPhoto && (
                    <EditPhotoModal 
                        isOpen={editModalOpen} 
                        onRequestClose={closeEditModal} 
                        photoItem={selectedPhoto} 
                    />
                )}
            </div>
        </section>
    );
};

export default GallerySection;