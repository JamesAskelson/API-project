import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./EditReview.css";
import { updateReview } from "../../store/reviews";
import { createReview, getUserReviews } from "../../store/reviews";
import { getSpotById } from "../../store/spots";

export function EditReviewModal({ review, reviewId }) {
    const dispatch = useDispatch();
    const [reviewText, setReviewText] = useState(review?.review);
    const [stars, setStars] = useState(review.stars);
    const [color, setColor] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    console.log('review', review)

    useEffect(() => {
        const errors = {}
        if(reviewText.length < 10) errors.reviewText = 'Review must have a minimum of 10 characters'
        if(stars === 0) errors.stars = 'Please select a star rating'
        setErrors(errors)
    }, [stars, reviewText])

    const handleSubmit = (e) => {
        e.preventDefault()

        const edittedReview = {
            review: reviewText,
            stars: stars
        }
        return dispatch(updateReview(edittedReview, reviewId))
            // .then(() => dispatch(getSpotById(spotId)))
            .then(() => dispatch(getUserReviews()))
            .then(closeModal)
    }

    return (
        <div id='post-review-modal-container'>
            <form onSubmit={handleSubmit}>
                <h2 className="edit-review-title">
                    {`How was your stay at ${review?.Spot?.name}?`}
                </h2>
                    <textarea
                    className="post-review-textarea"
                    type="text"
                    placeholder='Leave your review here...'
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}>
                    </textarea>
                    <div id="review-stars-container">
                        <div
                            className={stars >= 1 ? "filled" : "empty"}
                            id={color >= 1 ? 'filled' : 'empty'}
                            onMouseEnter={() => setColor(1)}
                            onMouseLeave={() => setColor(0)}
                            onClick={() => setStars(1)}
                        >
                            <i className="fa fa-star"></i>
                        </div>
                        <div
                            className={stars >= 2 ? "filled" : "empty"}
                            id={color >= 2 ? 'filled' : 'empty'}
                            onMouseEnter={() => setColor(2)}
                            onMouseLeave={() => setColor(0)}
                            onClick={() => setStars(2)}
                        >
                            <i className="fa fa-star"></i>
                        </div>
                        <div
                            className={stars >= 3 ? "filled" : "empty"}
                            id={color >= 3 ? 'filled' : 'empty'}
                            onMouseEnter={() => setColor(3)}
                            onMouseLeave={() => setColor(0)}
                            onClick={() => setStars(3)}
                        >
                            <i className="fa fa-star"></i>
                        </div>
                        <div
                            className={stars >= 4 ? "filled" : "empty"}
                            id={color >= 3 ? 'filled' : 'empty'}
                            onMouseEnter={() => setColor(4)}
                            onMouseLeave={() => setColor(0)}
                            onClick={() => setStars(4)}
                        >
                            <i className="fa fa-star"></i>
                        </div>
                        <div
                            className={stars >= 5 ? "filled" : "empty"}
                            id={color >= 3 ? 'filled' : 'empty'}
                            onMouseEnter={() => setColor(5)}
                            onMouseLeave={() => setColor(0)}
                            onClick={() => setStars(5)}
                        >
                            <i className="fa fa-star"></i>
                        </div>
                        <div className="review-stars-text">
                            stars
                        </div>
                    </div>
                    <div id="review-button-container">
                        <button
                        className="review-submit"
                        type='submit'
                        disabled={Object.values(errors).length > 0}>
                            Submit your Review
                        </button>
                    </div>
            </form>
        </div>
    )
}
