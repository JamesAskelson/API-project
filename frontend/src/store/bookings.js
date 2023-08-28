import { csrfFetch } from './csrf';

const GET_BOOKINGS_BY_ID = 'bookings/getSpotBookings';
const GET_BOOKINGS_BY_USER = 'bookings/getUserBookings';
const RECEIVE_BOOKING = 'bookings/recieveBooking'

const getSpotBookings = (bookings) => ({
    type: GET_BOOKINGS_BY_ID,
    bookings
})

const getUserBookings = (bookings) => ({
    type: GET_BOOKINGS_BY_USER,
    bookings
})

const recieveBooking = (booking) => ({
    type: RECEIVE_BOOKING,
    booking
})

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

export const createBooking = (booking, spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(booking)
        })
        if (res.ok) {
            const newBooking = await res.json()
            dispatch(recieveBooking(newBooking))
            return null;
        } else{
            const errors = await res.json()
            return errors;
        }
    } catch (err) {
        return await err.json()
    }
}


const initialState = { userBookings: {}, spotBookings: {} }

const bookingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_BOOKINGS_BY_ID:
            const newSpotState = {
                ...state, // Spread the existing state properties
                spotBookings: {} // Initialize the spotBookings property
              };
            action.bookings.Bookings.forEach((booking) => {
                console.log('booking', booking)
                newSpotState.spotBookings[booking.id] = booking;
            })
            return newSpotState;
        case GET_BOOKINGS_BY_USER:
            const newUserState = {
                ...state, // Spread the existing state properties
                userBookings: {} // Initialize the userBookings property
              };
            action.bookings.Bookings.forEach((booking) => {
                newUserState.userBookings[booking.id] = booking;
            })
            return newUserState;
        case RECEIVE_BOOKING:
            return {...state, spotBookings: {...state.spotBookings, [action.booking.id]: action.booking}}
        default:
            return state;
    }
}

export default bookingsReducer;
