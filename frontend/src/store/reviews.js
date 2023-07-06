import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/getReviews';
const RECEIVE_REVIEW = 'reviews/reviewReview';

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

const receiveReview = (review) => ({
    type: RECEIVE_REVIEW,
    review
})

export const getReviewById = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`)
    if(res.ok) {
        const reviews = await res.json();
        dispatch(getReviews(reviews))
    }
}

const initialState = { userReviews: {}, spotReviews: {} }

const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_REVIEWS:
            const newState = {};
            action.reviews.Reviews.forEach((review) => {
                newState[review.id] = review;
            })
            return {...state, spotReviews: newState};
        default:
            return state;
    }
}

export default reviewsReducer
