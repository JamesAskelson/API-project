import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearState, getUserSpots } from "../../../store/spots";
import './UserSpotIndex.css'
import { SpotIndexItem } from "../SpotIndexItem/SpotIndexItem";
import { Link, useHistory } from "react-router-dom";
import OpenModalButton from '../../OpenModalButton'
import { DeleteSpotModal } from '../../DeleteSpotModal/DeleteSpot'
import { NavLink } from "react-router-dom";






export const UserSpotIndex = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const user = useSelector(state => Object.values(state.session.user))
    const spots = useSelector(state => Object.values(state.spots.userSpots))
    // console.log('user',user)
    // console.log('spots', spots)




    useEffect(() => {
        dispatch(getUserSpots());
        dispatch(clearState())
    }, [dispatch])

    if(!user) history.push('/')
    if(!spots) return null;


    return (
        <div>
            <div id='manage-spots-title'>
                <span className="manage-spots-title-text">Manage Your Spots</span>
                <Link className='open-modal-button' to='/spots/new'>
                    <button className='manage-spots-create-button'>
                        Create a New Spot
                    </button>
                </Link>
            </div>
            <div id='spots-container'>
                {spots.length > 0 ? (
                    <>
                    {spots.map((spot) => (
                        <div key={spot.id}>
                        <SpotIndexItem spot={spot} />
                        <div id='update-delete-spot-container'>
                            <Link className='open-modal-button' to={`${spot.id}/edit`}>
                            <button>Update</button>
                            </Link>
                            <div className='open-modal-button'>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteSpotModal spot={spot} />}
                            />
                            </div>
                        </div>
                        </div>
                    ))}
                    </>
                ) : (
                    <NavLink className='create-a-spot-link' exact to='/spots/new'>
                    Create a new Spot
                    </NavLink>
                )}
                </div>
        </div>
    )
}
