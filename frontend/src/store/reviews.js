import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/getReviews';
const GET_REVIEWS_BY_USER = 'reviews/getReviewsByUser'
const RECEIVE_REVIEW = 'reviews/reviewReview';
const REMOVE_REVIEW = 'reviews/removeReview'


const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

const getReviewsByUser = (reviews) => ({
    type: GET_REVIEWS_BY_USER,
    reviews
})

const receiveReview = (review) => ({
    type: RECEIVE_REVIEW,
    review
})

const removeReview = (review) => ({
    type: REMOVE_REVIEW,
    review
})



export const getReviewById = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`)
    if(res.ok) {
        const reviews = await res.json();
        dispatch(getReviews(reviews))
    }
}

export const getUserReviews = () => async (dispatch) => {
    const res = await csrfFetch('/api/reviews/current')
    if(res.ok) {
        const reviews = await res.json();
        dispatch(getReviewsByUser(reviews))
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

export const deleteReview = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })

    if(res.ok) {
        dispatch(removeReview(review))
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
        case GET_REVIEWS_BY_USER:
            const userReviewsState = {};
            console.log('action.reviews',action.reviews.Reviews)
            action.reviews.Reviews.forEach((review) => {
                userReviewsState[review.id] = review;
            })
            return {...state, userReviews: userReviewsState};
        case RECEIVE_REVIEW:
            return {...state, spotReviews: {...state.spotReviews, [action.review.id]: action.review}}
        case REMOVE_REVIEW:
            const removeReviewState = {...state, userReviews:{...state.userReviews}, spotReviews: {...state.spotReviews}}
            delete removeReviewState.userReviews[action.review.id]
            delete removeReviewState.spotReviews[action.review.id]
            return removeReviewState;
        default:
            return state;
    }
}

export default reviewsReducer;
