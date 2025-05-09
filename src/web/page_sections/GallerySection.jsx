import axios from "axios";
import { useEffect, useState } from "react";
import ImageModal from "../components/modals/ImageModal";

const GallerySection = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/gallery");
                const sortedPhotos = response.data.sort((a, b) => a.numberOrder - b.numberOrder);
                setPhotos(sortedPhotos);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || err.message);
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
    };

    const closeModal = () => {
        setModalImage(null);
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

    return (
        <section className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    {photos.map((photo) => (
                        <div key={photo._id} className="col-md-4 mb-4 gallery-item" onClick={() => openModal(photo.imageLocation)}>
                            <div className="card ms-auto">
                                <img 
                                src={`/${photo.imageLocation}`} 
                                alt={photo.title || "Gallery image"}
                                className="card-img-top"
                                />
                                
                                {photo.title && (
                                    <div className="card-body">
                                        <p className="card-text text-center">{photo.title}</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
                {/* Modal na obrázok */}
                {modalImage && (
                    <ImageModal modalImage={modalImage} closeModal={closeModal} />
                )}
            </div>
        </section>
    );
};

export default GallerySection;