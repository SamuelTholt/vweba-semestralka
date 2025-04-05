import NavigationBar from "../components/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";

import imageONas from "../assets/images/o_nas.jpg";

const AboutUsPage = () => {
    return (
        <div className="oNas">
            <NavigationBar/>
            <HeaderWithImage
                title="O nás"
                bgImage={imageONas}
                shapeDivider="shapedivider_waves-with-pizza"
            />
        </div>
    )
}

export default AboutUsPage;