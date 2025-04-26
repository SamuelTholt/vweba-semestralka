import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageReview from "../../assets/images/rating.jpg"
import AddReviewSection from "../page_sections/ButtonAddReviewSection";
import ReviewSection from "../page_sections/ReviewSection";


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
            <ReviewSection/>
        </div>
    );
}

export default ReviewPage;