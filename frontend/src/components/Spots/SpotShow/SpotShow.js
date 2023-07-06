import './SpotShow.css'
import { getSpotById } from '../../../store/spots'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getReviewById } from '../../../store/reviews'

export const SpotShow = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector(state => state.spots.singleSpot)
    const reviews = useSelector(state => Object.values(state?.reviews?.spotReviews))

    const formatDate = (createdAtTime) => {
        const date = new Date(createdAtTime);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric'});
    }

    const previewSpotImages = spot?.SpotImages?.filter(img => img.preview === true)
    const otherSpotImages = spot?.SpotImages?.filter(img => img.preview === false)
    // console.log('preview', previewSpotImages.url)
    // console.log('preview url', previewSpotImages.url)
    // console.log('rest', otherSpotImages)
    // console.log('spotshow spot', spot)
    console.log('reviews', reviews)
    // console.log(createDate)

    useEffect(() => {
        dispatch(getSpotById(spotId))
        dispatch(getReviewById(spotId))
    }, [dispatch, spotId])

    if (!spot) return null;


        const handleClick = () => {
          alert('Feature Coming Soon...');
        };


    return (
        <div id='spot-details-container'>
            <div id='spot-name-location'>
                <h2>
                    {spot.name}
                </h2>
                <h3>
                    {spot.city}, {spot.state}, {spot.country}
                </h3>
            </div>
            <div id='spot-all-images'>
                <div className='spot-prev-image'>
                    {previewSpotImages &&
                        <img src={previewSpotImages[0]?.url} alt='preview image'/>
                    }
                </div>
                <div className='spot-other-images'>
                    {otherSpotImages &&
                        otherSpotImages.map((image) => (
                            <div className='spot-image'>
                                 <img src={image.url} alt='other image' key={image.id} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div id='spot-info'>
                <div className='spot-description'>
                    <h2>
                        Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}
                    </h2>
                    <p>
                        {spot?.description}
                    </p>
                </div>
                <div className='spot-price-rating'>
                    <div className='price-rating'>
                        <div className='price'>
                            <p className='price-number'>
                                ${spot?.price}
                            </p>
                            <p className='price-text'>
                                night
                            </p>
                        </div>
                        <div className='rating'>
                            ★{spot?.avgRating} • {spot?.reviewCount} reviews
                        </div>
                    </div>
                    <div className='reserve-button'>
                        <button onClick={handleClick}>
                            Reserve
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
                <div>
                    <h2>
                         ★{spot?.avgRating} • {spot?.reviewCount} reviews
                    </h2>
                </div>
                {reviews?.map( (review) => (
                    <div className='individual-review'>
                        <div className='review-name'>
                            {review?.User?.firstName}
                        </div>
                        <div className='review-date'>
                            {formatDate(review?.createdAt)}
                        </div>
                        <div className='review'>
                            {review?.review}
                        </div>
                    </div>
                ))}
        </div>
    )
}
