import NavigationBar from "../components/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageReview from "../../assets/images/rating.jpg"
import AddReviewSection from "../page_sections/ButtonAddReviewSection";


const ReviewPage = () => {
    return (
        <div className="review">
            <NavigationBar/>
            <HeaderWithImage
                title="Recenzie"
                bgImage={imageReview}
                shapeDivider="shapedivider-mutliple_waves"
            />
            <AddReviewSection/>
        </div>
    );
}

export default ReviewPage;