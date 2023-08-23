import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserReviews } from "../../../store/reviews";
import { DeleteReviewModal } from "../../DeleteReviewModal/DeleteReview"
import OpenModalButton from '../../OpenModalButton'
import { EditReviewModal } from "../../EditReviewButton/EditReview";
import "./UserReviews.css"


export const UserReviewsIndex = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => Object.values(state.session.user))
    const reviews = useSelector(state => Object.values(state.reviews.userReviews))

    const formatDate = (createdAtTime) => {
        const date = new Date(createdAtTime);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric'});
    }

    useEffect(() => {
        dispatch(getUserReviews());
    }, [dispatch])

    return (
        <div id='manage-reviews-main-container'>
            <div id='manage-reviews-title'>
                <h1>Manage Reviews</h1>
            </div>
            <div>
            {reviews?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => {
                    // console.log('firstName', review?.User?.firstName);
                    // console.log('lastName', review?.User?.lastName);
                    // console.log(review.userId)
                    console.log('review', review)
                    return (
                        <div className='individual-user-review'>
                            <div className='user-review-name'>
                                <h3>{review?.Spot?.name}</h3>
                            </div>
                            <div className='user-review-date'>
                                {formatDate(review?.createdAt)}
                            </div>
                            <div className='user-review'>
                                {review?.review}
                            </div>
                            <div id='user-review-buttons'>
                                <div className='open-modal-button'>
                                    <OpenModalButton
                                    buttonText="Edit"
                                    modalComponent={<EditReviewModal review={review} reviewId={review.id} />}
                                    />
                                </div>
                                <div className='open-modal-button'>
                                    <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteReviewModal review={review} spotId={review.spotId} />}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                    })}
            </div>
        </div>
    )
}
