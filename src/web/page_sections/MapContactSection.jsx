
import useInViewAnim from "../hooks/useInViewAnimation";


const TeamSection = () => {
    const [ref, isVisible] = useInViewAnim();

    return (
        <section className="py-5 shapedivider-opacity-wave"
        style={{ backgroundColor:"#3A4F50" }}>
        <div ref={ref} 
        className={`container my-5 whiteColor ${isVisible ? "grow-animation" : "hidden"}`}>
            <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                    <h2 style={{ marginTop:150 }}>Nájdete nás na tejto adrese:</h2>
                    <p className="lead">
                        031 01 Liptovský Mikuláš, Námestie mieru
                    </p>

                </div>
            </div>
        </div>


        <div ref={ref} 
        className={`ontainer-fluid g-0 ${isVisible ? "grow-animation" : "hidden"}`}>
            <div className="row g-0">
                <div className="col-md-12">
                    <div className="lc-block overflow-hidden">
                        <div style={{ maxHeight: '40vh' }} className="ratio ratio-1x1">
                            <iframe src="https://www.google.com/maps?q=N%C3%A1mestie+Mieru%2C+Liptovsk%C3%BD+Mikul%C3%A1%C5%A1&amp;t=m&amp;z=12&amp;output=embed&amp;iwloc=near"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}

export default TeamSection;