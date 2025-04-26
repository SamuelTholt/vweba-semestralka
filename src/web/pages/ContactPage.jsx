import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageContact from "../../assets/images/contact-banner-2.jpg"
import ContactSection from "../page_sections/ContactSection";
import MapContactSection from "../page_sections/MapContactSection";

const ContactPage = () => {
  return (
      <div className="kontakt">
        <NavigationBar/>
        <HeaderWithImage
                title="..."
                bgImage={imageContact}
                shapeDivider="shapedivider-special-waves"
            />
        <ContactSection/>
        <MapContactSection/>
      </div>
  );
}

export default ContactPage;