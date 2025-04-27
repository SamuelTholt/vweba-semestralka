import React, { useContext, useState } from "react";
import useInViewAnim from "../hooks/useInViewAnimation";
import MenuModal from "../components/modals/MenuModal";
import { AuthContext } from "../contexts/AuthContext";

const AddMenuSection = () => {
    const { user } = useContext(AuthContext);
    const [ref, isVisible] = useInViewAnim();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

    const isAdmin = user?.role === "admin";
  
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
                    Pridať menu item
                    </button>
              </div>
            )}
          </div>
        </div>

        <MenuModal 
          isOpen={isModalOpen} 
          onRequestClose={closeModal} 
        />
      </section>
    );
  };
  
  export default AddMenuSection;