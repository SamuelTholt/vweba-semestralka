import React, { useContext } from "react";
import ImageModal from "../components/modals/ImageModal";
import EditPhotoModal from "../components/modals/EditPhotoModal";
import { GalleryContext } from "../contexts/GalleryContext";

const GallerySection = () => {
    const {
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
        isAdmin,
    } = useContext(GalleryContext);
    

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
    return (
        <section className="py-5">
        <div className="container">
            <div className="row justify-content-center">
            {photos.length === 0 ? (
                <div className="col-12 text-center whiteColor">
                <p>Žiadne fotografie na zobrazenie.</p>
                </div>
            ) : (
                photos.map((photo) => (
                <div
                    key={photo._id}
                    className="col-md-3 mb-4 gallery-item"
                    onClick={(e) => openModal(photo.imageLocation, e)}
                >
                    <div className="card ms-auto position-relative">
                    <img
                        src={formatImageUrl(photo.imageLocation)}
                        alt={photo.title || "Gallery image"}
                        className="card-img-top"
                    />

                    {photo.title && (
                        <div className="card-body">
                        <p className="card-text text-center">{photo.title}</p>
                        </div>
                    )}

                    {isAdmin() && (
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

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="row mt-4">
                <div className="col-12">
                <nav>
                    <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        >
                        &laquo;
                        </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                        <button
                            className="page-link"
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

            {/* Image Modal */}
            {modalImage && <ImageModal modalImage={modalImage} closeModal={closeModal} />}

            {/* Edit Photo Modal */}
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