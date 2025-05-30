import { useEffect, useRef, useState } from "react";

const useInViewAnim = (threshold = 0.5) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);    
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };

    }, [threshold]);

    return [ref, isVisible];
};

export default useInViewAnim;