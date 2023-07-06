import { Link } from 'react-router-dom'
import './SpotIndexItem.css'


export const SpotIndexItem = ({spot}) => {

    return (
        <div id='spot-main-container'>
            <Link to ={`/spots/${spot.id}`} className='spot-link' title={spot.name}>
                <img className='spot-preview-img' src={spot.previewImage} alt={spot.address}/>
                <div id='spots-details-container'>
                    <div id='spot-city-state'>
                        <p>{`${spot.city}, ${spot.state}`}</p>
                        <p>{`$${spot.price} night`}</p>
                    </div>
                    <div id='spot-rating'>
                        <p>★{spot.avgRating ? spot.avgRating : 'New'}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}
