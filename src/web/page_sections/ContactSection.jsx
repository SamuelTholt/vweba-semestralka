import React, { useEffect, useState } from 'react';
import useInViewAnim from "../hooks/useInViewAnimation";

const ContactSection = () => {
    const [ref, isVisible] = useInViewAnim();
    const [openingHoursList, setOpeningHoursList] = useState([]);
    const [emailVisible, setEmailVisible] = useState(false);
    const [phoneVisible, setPhoneVisible] = useState(false);

    useEffect(() => {
        const days = ["Pon", "Ut", "Str", "Štv", "Pia", "Sob", "Ne"];
        const hours = ["12:00 - 22:00", "12:00 - 22:00", "12:00 - 22:00", "12:00 - 22:00", "10:00 - 0:00", "12:00 - 0:00", "12:00 - 22:00"];

        let index = 0;

        const interval = setInterval(() => {
        if (index < days.length) {
            setOpeningHoursList(prev => [...prev, { day: days[index], hour: hours[index] }]);
            index++;
        } else {
            clearInterval(interval);
        }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-5">
        <div ref={ref} 
        className={`container my-5 whiteColor ${isVisible ? "grow-animation" : "hidden"}`}>
            <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
                <h1 className="display-4 custom-heading">Otváracie Hodiny</h1>
                <p className="lead">
                {openingHoursList.map((item, index) => (
                    <span key={index}>
                    <span className="bold">{item.day} </span> {item.hour}<br />
                    </span>
                ))}
                </p>

                <h2 className="display-4 custom-heading">Kontaktujte nás:</h2>
                <p className="lead">
                <span className="bold">Email:</span>{' '}
                <span
                    onClick={() => setEmailVisible(true)}
                    style={{ cursor: 'pointer' }}
                >
                    {emailVisible ? 'LKPizzeria@gmail.com' : 'Zobraziť email'}
                </span>
                <br />
                <span className="bold">Telefón:</span>{' '}
                <span
                    onClick={() => setPhoneVisible(true)}
                    style={{ cursor: 'pointer' }}
                >
                    {phoneVisible ? '+421 442 069 943, 044/206 99 43' : 'Zobraziť telefónne číslo'}
                </span>
                </p>
            </div>
            </div>
        </div>
        </section>
    );
};

export default ContactSection;
