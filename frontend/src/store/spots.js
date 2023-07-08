import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/getSpots'
const GET_SPOTS_BY_USER = 'spots/getSpotsByUser'
const RECEIVE_SPOT = 'spots/receiveSpot'
const UPDATE_SPOT = 'spots/updateSpot'
const REMOVE_SPOT = 'spots/removeSpot'
const CLEAR_STATE = 'spots/clearState'

const getSpots = (spots) => ({
    type: GET_SPOTS,
    spots,
})

const getSpotsByUser = (spots) => ({
    type: GET_SPOTS_BY_USER,
    spots
})

const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
})

const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

const removeSpot = (spot) => ({
    type: REMOVE_SPOT,
    spot
})

export const clearState = () => ({
    type: CLEAR_STATE
})


export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const spots = await res.json();
    dispatch(getSpots(spots))
    // console.log(spots)
}

export const getSpotById = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}`)
    if(res.ok) {
        const spot = await res.json();
        dispatch(receiveSpot(spot))
        // console.log(spot)
    }
}

export const getUserSpots = () => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/current`)
    if(res.ok) {
        const spots = await res.json();
        dispatch(getSpotsByUser(spots))
    }
}

export const createSpot = (spot) => async (dispatch) => {
    try{
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(spot)
        })
        if(res.ok) {
            const newSpot = await res.json()
            dispatch(receiveSpot(newSpot))
            return newSpot.id
        } else {
            const errors = await res.json()
            return errors;
        }
    } catch (err) {
        return await err.json()
    }
}

export const updateSpot = (spot, id) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(spot)
        })
        if(res.ok) {
            const spotEdit = await res.json();
            dispatch(editSpot(spotEdit))
            return spotEdit.id;
        } else {
            const errors = await res.json()
            return errors
        }
    } catch (err) {
        return await err.json()
    }
}

export const addImageToSpot = (spotId, preview, url) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, preview})
    })
    if(res.ok) {
        const newImage = await res.json()
        return newImage
    } else {
        const errors = await res.json()
        return errors;
    }
}

export const deleteSpot = (spot) => async (dispatch) => {
    console.log('spot.id',spot.id)
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });

    if(res.ok) {
        dispatch(removeSpot(spot))
    }
}

const initialState = { allSpots: {}, userSpots: {}, singleSpot: {}}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_SPOTS:
        const newState ={...state};
        action.spots.Spots.forEach((spot) => {
            newState.allSpots[spot.id] = spot;
        });
        return newState;
      case GET_SPOTS_BY_USER:
        const newStateUserSpots = {...state};
        action.spots.Spots.forEach((spot) => {
            newStateUserSpots.userSpots[spot.id] = spot
        });
        return newStateUserSpots
      case RECEIVE_SPOT:
        const spotState = initialState.singleSpot;
        return {...state, singleSpot: action.spot}
      case UPDATE_SPOT:
        return {...state, allSpots: {...state.allSpots, [action.spot.id]: action.spot}}
      case REMOVE_SPOT:
        const spotsState = {...state, allSpots:{...state.allSpots}, userSpots: {...state.userSpots}}
        delete spotsState.userSpots[action.spot.id]
        delete spotsState.allSpots[action.spot.id]
        return spotsState;
      case CLEAR_STATE:
        return {...state, allSpots: {...state.allSpots}, singleSpot: {}}
      default:
        return state;
    }
}

export default spotsReducer;
