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

export const createReview = (review, spotId) => async (dispatch, getState) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(review)
        })
        if(res.ok) {
            const newReview = await res.json()
            const currentState = getState()
            const userData = currentState.session
            console.log(userData)

            newReview.User = userData.user
            dispatch(receiveReview(newReview))
        } else {
            const errors = await res.json()
            return errors;
        }
    } catch (err) {
        return await err.json()
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
        case RECEIVE_REVIEW:
            return {...state, spotReviews: {...state.spotReviews, [action.review.id]: action.review}}
        default:
            return state;
    }
}

export default reviewsReducer;
