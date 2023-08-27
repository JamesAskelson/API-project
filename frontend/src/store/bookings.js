import { csrfFetch } from './csrf';

const GET_BOOKINGS_BY_ID = 'bookings/getSpotBookings';
const GET_BOOKINGS_BY_USER = 'bookings/getUserBookings';

const getSpotBookings = (bookings) => ({
    type: GET_BOOKINGS_BY_ID,
    bookings
})

const getUserBookings = (bookings) => ({
    type: GET_BOOKINGS_BY_USER,
    bookings
})

const createBooking = (booking) => ({})

export const getAllSpotBookings = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`)
    if (res.ok) {
        const spotBookings = await res.json();
        await dispatch(getSpotBookings(spotBookings))
    }
}

export const getAllUserBookings = () => async (dispatch) => {
    const res = await csrfFetch(`/api/bookings/current`)
    if (res.ok) {
        const userBookings = await res.json();
        await dispatch(getUserBookings(userBookings))
    }
}


const initialState = { userBookings: {}, spotBookings: {} }

const bookingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_BOOKINGS_BY_ID:
            const newSpotState = {...state};
            action.bookings.Bookings.forEach((booking) => {
                newSpotState.spotBookings[booking.id] = booking;
            })
            return newSpotState;
        case GET_BOOKINGS_BY_USER:
            const newUserState = {...state};
            action.bookings.Bookings.forEach((booking) => {
                newUserState.userBookings[booking.id] = booking;
            })
            return newUserState;
        default:
            return state;
    }
}

export default bookingsReducer;
