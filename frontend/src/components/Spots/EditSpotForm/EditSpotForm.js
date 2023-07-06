import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot, getSpotById } from "../../../store/spots";
import './EditSpotForm.css'


export const EditSpotForm = () => {
    const dispatch = useDispatch();
    const spotInfo = useSelector(state => state?.spots?.singleSpot)
    console.log('spot info',spotInfo)
    const history = useHistory();
    const { spotId } = useParams();
    const [country, setCountry] = useState(spotInfo?.country);
    const [address, setAddress] = useState(spotInfo?.address);
    const [city, setCity] = useState(spotInfo?.city);
    const [state, setState] = useState(spotInfo?.state);
    const [description, setDescription] = useState(spotInfo?.description);
    const [name, setName] = useState(spotInfo?.name);
    const [price, setPrice] = useState(spotInfo?.price);
    const [lat, setLat] = useState(spotInfo?.lat);
    const [lng, setLng] = useState(spotInfo?.lng);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const spot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }
        console.log('before dispatch', spot)
        const res = await dispatch(updateSpot(spot, spotId))


        if(res.errors) {
            const errors = res.errors
            console.log(errors)
            if(description.length < 30) errors.description = "Description needs a minimum of 30 characters"
            // if(previewImg === "") errors.previewImg = "Preview image is required"
            // if(!(urlCheck(previewImg)) ) errors.previewImgInvalid = "Image URL must end in .png, .jpg, or .jpeg"
            // if (!(urlCheck(imgOne)) && imgOne !== '') errors.imgOneInvalid = "Image URL must end in .png, .jpg, or .jpeg";
            // if (!(urlCheck(imgTwo)) && imgTwo !== '') errors.imgTwoInvalid = "Image URL must end in .png, .jpg, or .jpeg";
            // if (!(urlCheck(imgThree)) && imgThree !== '') errors.imgThreeInvalid = "Image URL must end in .png, .jpg, or .jpeg";
            // if (!(urlCheck(imgFour)) && imgFour !== '') errors.imgFourInvalid = "Image URL must end in .png, .jpg, or .jpeg";
            setErrors(errors)
        } else {
            history.push(`/spots/${spot.id}`)

            setAddress('')
            setCity('')
            setState('')
            setCountry('')
            setName('')
            setDescription('')
            setPrice('')
            // setPreviewImg('')
            // setImgOne('')
            // setImgTwo('')
            // setImgThree('')
            // setImgFour('')
            setErrors({})
        }
    }

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch])

    useEffect(() => {
    }, [address, city, state, country, lat, lng, name, description, price])

    // const urlCheck = (url) => {
    //     return ( url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg'))
    // }

    return (
        <div id='create-spot-content'>
            <h2 className='create-spot-title'>
                Update your Spot
            </h2>
            <p className="spot-title-description-1">
                Where's your place located?
            </p>
            <p className="spot-title-description-2">
                Guests will only get your exact address once they booked a reservation
            </p>
            <form className='spot-form' onSubmit={handleSubmit}>
                <label className="country-input">
                    <div>
                    Country {errors.country && <span className="error">{errors.country}</span>}
                    </div>
                    <input type='text' placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}/>
                </label>
                <label className="address-input">
                    <div>
                    Address {errors.address && <span className="error">{errors.address}</span>}
                    </div>
                    <input type='text' placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                </label>
                <div className="city-state-content">
                    <div className="city-content">
                        <label className="city-input">
                        <div>
                            City {errors.city && <span className="error">{errors.city}</span>}
                        </div>
                            <input type='text' placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}/>
                        </label>
                    </div>
                    <div className="city-state-comma">
                        ,
                    </div>
                    <div className="state-content">
                        <label className="state-input">
                        <div>
                            State {errors.state && <span className="error">{errors.state}</span>}
                        </div>
                            <input type='text' placeholder="State" value={state} onChange={(e) => setState(e.target.value)}/>
                        </label>
                    </div>
                </div>
                <div className="lat-lng-content">
                    <div className="lat-content">
                        <label className="lat-input">
                            <div>
                                Latitude {errors.lat && <span className="error">{errors.lat}</span>}
                            </div>
                            <input type='text' placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)}/>
                        </label>
                    </div>
                    <div className="lat-lng-comma">
                        ,
                    </div>
                    <div className="lng-content">
                        <label className="lng-input">
                            <div>
                                Longitude {errors.lng && <span className="error">{errors.lng}</span>}
                            </div>
                            <input type='text' placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)}/>
                        </label>
                    </div>
                </div>
                <div>
                    <hr class="thick-line"/>
                </div>
                <p className="spot-description-title">
                    Describe your place to guests
                </p>
                <p className="spot-description-info">
                    Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                </p>
                <label className="spot-description-input">
                    <textarea type='text' placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                {errors.description && <span className="error">{errors.description}</span>}
                <div>
                    <hr class="thick-line"/>
                </div>
                <div className="spot-name-title">
                    Create a title for your spot
                </div>
                <div className="spot-name-info">
                    Catch guests' attention with a spot title that highlights what makes your place special.
                </div>
                <label className="spot-name-input">
                    <input type='text' placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                {errors.name && <span className="error">{errors.name}</span>}
                <div>
                    <hr class="thick-line"/>
                </div>
                <div className="spot-price-title">
                    Set a base price for your spot
                </div>
                <div className="spot-price-info">
                    Competitive pricing can help your listing stand out and rank higher in search results.
                </div>
                <div className="spot-price-input-container">
                    <div className="dollar-sign-icon">
                        $
                    </div>
                    <label className="spot-price-input">
                        <input type='text' placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </label>
                </div>
                {errors.price && <span className="error">{errors.price}</span>}
                <div>
                    <hr class="thick-line"/>
                </div>
                <div className="spot-images-title">
                    Set a base price for your spot
                </div>
                <div className="spot-images-info">
                    Competitive pricing can help your listing stand out and rank higher in search results.
                </div>
                {/* <div className="spot-images-container">
                    <label className="spot-review-image-input">
                        <input type='text' placeholder="Preview Image URL" value={previewImg} onChange={(e) => setPreviewImg(e.target.value)}/>
                    </label>
                    {errors.previewImg && <span className="error">{errors.previewImg}</span>}
                    {errors.previewImgInvalid && <span className="error">{errors.previewImgInvalid}</span>}
                    <label className="spot-image1-input">
                        <input type='text' placeholder="Image URL" value={imgOne} onChange={(e) => setImgOne(e.target.value)}/>
                    </label>
                    {errors.imgOneInvalid && <span className="error">{errors.imgOneInvalid}</span>}
                    <label className="spot-image2-input">
                        <input type='text' placeholder="Image URL" value={imgTwo} onChange={(e) => setImgTwo(e.target.value)}/>
                    </label>
                    {errors.imgTwoInvalid && <span className="error">{errors.imgTwoInvalid}</span>}
                    <label className="spot-image3-input">
                        <input type='text' placeholder="Image URL" value={imgThree} onChange={(e) => setImgThree(e.target.value)}/>
                    </label>
                    {errors.imgThreeInvalid && <span className="error">{errors.imgThreeInvalid}</span>}
                    <label className="spot-image4-input">
                        <input type='text' placeholder="Image URL" value={imgFour} onChange={(e) => setImgFour(e.target.value)}/>
                    </label>
                    {errors.imgFourInvalid && <span className="error">{errors.imgFourInvalid}</span>}
                </div> */}
                <div>
                    <hr class="thick-line"/>
                </div>
                <button className="spot-create-submit-button" type='submit' onClick={handleSubmit}>Create Spot</button>
            </form>
        </div>
    )
}
