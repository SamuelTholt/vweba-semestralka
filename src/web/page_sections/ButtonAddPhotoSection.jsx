import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useInViewAnim from "../hooks/useInViewAnimation";
import PhotoModal from "../components/modals/PhotoModal";

const AddPhotoSection = () => {
    const { user } = useContext(AuthContext);
    const [ref, isVisible] = useInViewAnim();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

  
    const isAdmin = ["admin", "hl.admin"].includes(user?.role);
  
    return (
      <section className="py-5" ref={ref}>
        <div className={`row justify-content-center ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}>
          <div className="col-lg-2">
            {isAdmin && (
                <div className="d-grid mb-2">
                    <button 
                        className="btn btn-lg btn-primary fw-bold text-uppercase bg-blue-400" 
                        type="button"
                        onClick={openModal}
                    >
                    Pridať fotografiu
                    </button>
              </div>
            )}
          </div>
        </div>
        <PhotoModal 
          isOpen={isModalOpen} 
          onRequestClose={closeModal} 
        />
      </section>
    );
};

export default AddPhotoSection;