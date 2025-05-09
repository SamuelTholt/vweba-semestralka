import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageGallery from "../../assets/images/italian-restaurant.jpg"
import AddPhotoSection from "../page_sections/ButtonAddPhotoSection";
import GallerySection from "../page_sections/GallerySection";

const PhotoPage = () => {
  return (
      <div className="fotogaleria">
        <NavigationBar/>
        <HeaderWithImage
                title="Fotogaléria"
                bgImage={imageGallery}
                shapeDivider="shapedivider_waves-with-pizza"
            />
        <AddPhotoSection/>
        <GallerySection/>
      </div>
  );
}

export default PhotoPage;