import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../../store/spots";
import './SpotIndex.css'
import { SpotIndexItem } from "../SpotIndexItem/SpotIndexItem";
import { getAllUserBookings } from "../../../store/bookings";


export const SpotIndex = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots.allSpots))

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch])

    return (
        <div id='spots-container'>
                {spots.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((spot) => (
                    <SpotIndexItem
                    spot={spot}
                    key={spot.id}
                    />
                ))}
        </div>
    )
}
