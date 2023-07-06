import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../../store/spots";
import './SpotIndex.css'
import { SpotIndexItem } from "../SpotIndexItem/SpotIndexItem";


export const SpotIndex = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots.allSpots))
    console.log(spots)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch])

    return (
        <div id='spots-container'>
                {spots.map((spot) => (
                    <SpotIndexItem
                    spot={spot}
                    key={spot.id}
                    />
                ))}
        </div>
    )
}
