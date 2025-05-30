import React, { useState } from "react";
import useInViewAnim from "../hooks/useInViewAnimation";
import ReviewModal from "../components/modals/ReviewModal";

const AddReviewSection = () => {
    const [ref, isVisible] = useInViewAnim();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <section className="py-5" ref={ref}>
        <div className={`row justify-content-center ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}>
          <div className="col-lg-2">
            <div className="d-grid mb-2">
              <button 
                className="btn btn-lg btn-primary fw-bold text-uppercase bg-blue-400" 
                type="button"
                onClick={openModal}
              >
                Napísať recenziu
              </button>
            </div>
          </div>
        </div>

        <ReviewModal 
          isOpen={isModalOpen} 
          onRequestClose={closeModal} 
        />
      </section>
    );
  };
  
  export default AddReviewSection;