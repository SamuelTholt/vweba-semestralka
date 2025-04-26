import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import WelcomeSection from "../page_sections/WelcomeSection";

import imageONas from "../../assets/images/o_nas.jpg";
import TeamSection from "../page_sections/TeamSection";

const AboutUsPage = () => {
    return (
        <div className="oNas">
            <NavigationBar/>
            <HeaderWithImage
                title="O nás"
                bgImage={imageONas}
                shapeDivider="shapedivider_waves-with-pizza"
            />
            <WelcomeSection/>

            <TeamSection/>
        </div>
    )
}

export default AboutUsPage;