const HeaderWithImage = ({ title, bgImage, shapeDivider }) => {
    return (
        <section 
        className={`py-5 bg-image-full ${shapeDivider}`}
        style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="text-center my-5">
                <h1 className="text-white fs-3 fw-bolder">{title}</h1>
            </div>
        </section>
    );
}

export default HeaderWithImage;