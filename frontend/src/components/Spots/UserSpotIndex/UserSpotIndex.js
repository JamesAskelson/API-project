import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../../store/spots";
import './UserSpotIndex.css'
import { SpotIndexItem } from "../SpotIndexItem/SpotIndexItem";
import { Link, useHistory } from "react-router-dom";



export const UserSpotIndex = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const user = useSelector(state => Object.values(state.session.user))
    const spots = useSelector(state => Object.values(state.spots.allSpots))
    const userSpots = spots.filter(spot => spot?.ownerId === user[0]);
    console.log('user',user)
    console.log('spots', spots)
    console.log('userSpots',userSpots)



    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch])

    if(!user) history.push('/')

    return (
        <div>
            <div id='manage-spots-title'>
                <span className="manage-spots-title-text">Manage Your Spots</span>
                <Link to='/spots/new'>
                    <button className='manage-spots-create-button'>
                        Create a New Spot
                    </button>
                </Link>
            </div>
            <div id='spots-container'>
                {userSpots.map((spot) => (
                    <div key={spot.id}>
                        <SpotIndexItem
                        spot={spot}
                        />
                        <div id='update-delete-spot-container'>
                            <Link to={`${spot.id}/edit`}>
                                <button>Update</button>
                            </Link>
                            <Link>
                                <button>Delete</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
