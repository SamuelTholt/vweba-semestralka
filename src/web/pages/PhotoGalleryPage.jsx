import NavigationBar from "../components/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageGallery from "../../assets/images/italian-restaurant.jpg"

const PhotoPage = () => {
  return (
      <div className="fotogaleria">
        <NavigationBar/>
        <HeaderWithImage
                title="Fotogaléria"
                bgImage={imageGallery}
                shapeDivider="shapedivider_waves-with-pizza"
            />
      </div>
  );
}

export default PhotoPage;