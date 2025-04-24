import NavigationBar from "../components/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageReview from "../../assets/images/rating.jpg"

const ReviewPage = () => {
    return (
        <div className="review">
            <NavigationBar/>
            <HeaderWithImage
                title="Recenzie"
                bgImage={imageReview}
                shapeDivider="shapedivider-mutliple_waves"
            />
         
        </div>
    );
}

export default ReviewPage;