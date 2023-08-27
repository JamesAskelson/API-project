import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImageToSpot, createSpot, deleteSpot } from "../../../store/spots";
import './SpotForm.css'

export const SpotForm = () => {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [imgOne, setImgOne] = useState('');
    const [imgTwo, setImgTwo] = useState('');
    const [imgThree, setImgThree] = useState('');
    const [imgFour, setImgFour] = useState('');
    const [errorValidation, setErrorValidation] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();


        const errors= {}
        if(!country) errors.country = "Country is required";
        if(!address) errors.address = "Address is required";
        if(!city) errors.city = "City is required";
        if(!state) errors.state = "State is required";
        if(description.length < 30) errors.description = "Description needs a minimum of 30 characters";
        if(!name) errors.name = 'Name is required'
        if(name.length > 50) errors.name = 'Name must be less than 50 characters';
        if(isNaN(price) || price <= 0) errors.price = 'Price per day is required';
        if(lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
        if(lng < -180 || lng > 180) errors.lng = "Longitude is not valid";
        if(!previewImg) errors.previewImg = "Preview image is required";
        if(!(urlCheck(previewImg)) ) errors.previewImgInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        if(imgOne){
            if(!(urlCheck(imgOne))) errors.imgOneInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if(imgTwo){
            if(!(urlCheck(imgTwo))) errors.imgTwoInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if(imgThree){
            if(!(urlCheck(imgThree))) errors.imgThreeInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if(imgFour){
            if(!(urlCheck(imgFour))) errors.imgFourInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        }
        setErrorValidation({...errors})

        // if(previewImg === '' || (!urlCheck(previewImg)) || description.length < 30) {
        //     if(description.length < 30) errors.description = "Description needs a minimum of 30 characters"
        //     if(previewImg === "") errors.previewImg = "Preview image is required"
        //     if(!(urlCheck(previewImg)) ) errors.previewImgInvalid = "Image URL must end in .png, .jpg, or .jpeg"
        //     if (!(urlCheck(imgOne)) && imgOne !== '') errors.imgOneInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        //     if (!(urlCheck(imgTwo)) && imgTwo !== '') errors.imgTwoInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        //     if (!(urlCheck(imgThree)) && imgThree !== '') errors.imgThreeInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        //     if (!(urlCheck(imgFour)) && imgFour !== '') errors.imgFourInvalid = "Image URL must end in .png, .jpg, or .jpeg";
        //         setErrorValidation(errors)
        // } else {
        //     // if(urlCheck(imgOne)) await dispatch(addImageToSpot(res, false, imgOne))
        //     // if(urlCheck(imgTwo)) await dispatch(addImageToSpot(res, false, imgTwo))
        //     // if(urlCheck(imgThree)) await dispatch(addImageToSpot(res, false, imgThree))
        //     // if(urlCheck(imgFour)) await dispatch(addImageToSpot(res, false, imgFour))
        //     }
        if(!Object.values(errors).length) {
            const spot = {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                previewImg
            }

            const res = await dispatch(createSpot(spot))
            await dispatch(addImageToSpot(res, true, previewImg))
            if(imgOne) await dispatch(addImageToSpot(res, false, imgOne))
            if(imgTwo) await dispatch(addImageToSpot(res, false, imgTwo))
            if(imgThree) await dispatch(addImageToSpot(res, false, imgThree))
            if(imgFour) await dispatch(addImageToSpot(res, false, imgFour))

            setAddress('')
            setCity('')
            setState('')
            setCountry('')
            setName('')
            setDescription('')
            setPrice('')
            setPreviewImg('')
            setImgOne('')
            setImgTwo('')
            setImgThree('')
            setImgFour('')
            setErrorValidation({})
            history.push(`/spots/${res}`)
        }

    }


    useEffect(() => {
    }, [address, city, state, country, lat, lng, name, description, price, previewImg])

    const urlCheck = (url) => {
        return ( url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg'))
    }

    if(!user) history.push('/')

    return (
        <div id='create-spot-content'>
            <h2 className='create-spot-title'>
                Create a new Spot
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
                    Country {errorValidation.country && <span className="error">{errorValidation.country}</span>}
                    </div>
                    <input type='text' placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}/>
                </label>
                <label className="address-input">
                    <div>
                    Address {errorValidation.address && <span className="error">{errorValidation.address}</span>}
                    </div>
                    <input type='text' placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                </label>
                <div className="city-state-content">
                    <div className="city-content">
                        <label className="city-input">
                        <div>
                            City {errorValidation.city && <span className="error">{errorValidation.city}</span>}
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
                            State {errorValidation.state && <span className="error">{errorValidation.state}</span>}
                        </div>
                            <input type='text' placeholder="State" value={state} onChange={(e) => setState(e.target.value)}/>
                        </label>
                    </div>
                </div>
                <div className="lat-lng-content">
                    <div className="lat-content">
                        <label className="lat-input">
                            <div>
                                Latitude {errorValidation.lat && <span className="error">{errorValidation.lat}</span>}
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
                                Longitude {errorValidation.lng && <span className="error">{errorValidation.lng}</span>}
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
                {errorValidation.description && <span className="error">{errorValidation.description}</span>}
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
                {errorValidation.name && <span className="error">{errorValidation.name}</span>}
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
                {errorValidation.price && <span className="error">{errorValidation.price}</span>}
                <div>
                    <hr class="thick-line"/>
                </div>
                <div className="spot-images-title">
                    Liven up your spot with photos
                </div>
                <div className="spot-images-info">
                    Submit a link to at least one photo to publish your spot.
                </div>
                <div className="spot-images-container">
                    <label className="spot-review-image-input">
                        <input type='text' placeholder="Preview Image URL" value={previewImg} onChange={(e) => setPreviewImg(e.target.value)}/>
                    </label>
                    {errorValidation.previewImg && <span className="error">{errorValidation.previewImg}</span>}
                    {errorValidation.previewImgInvalid && <span className="error">{errorValidation.previewImgInvalid}</span>}
                    <label className="spot-image1-input">
                        <input type='text' placeholder="Image URL" value={imgOne} onChange={(e) => setImgOne(e.target.value)}/>
                    </label>
                    {errorValidation.imgOneInvalid && <span className="error">{errorValidation.imgOneInvalid}</span>}
                    <label className="spot-image2-input">
                        <input type='text' placeholder="Image URL" value={imgTwo} onChange={(e) => setImgTwo(e.target.value)}/>
                    </label>
                    {errorValidation.imgTwoInvalid && <span className="error">{errorValidation.imgTwoInvalid}</span>}
                    <label className="spot-image3-input">
                        <input type='text' placeholder="Image URL" value={imgThree} onChange={(e) => setImgThree(e.target.value)}/>
                    </label>
                    {errorValidation.imgThreeInvalid && <span className="error">{errorValidation.imgThreeInvalid}</span>}
                    <label className="spot-image4-input">
                        <input type='text' placeholder="Image URL" value={imgFour} onChange={(e) => setImgFour(e.target.value)}/>
                    </label>
                    {errorValidation.imgFourInvalid && <span className="error">{errorValidation.imgFourInvalid}</span>}
                </div>
                <div>
                    <hr class="thick-line"/>
                </div>
                <button className="spot-create-submit-button" type='submit' onClick={handleSubmit}>Create Spot</button>
            </form>
        </div>
    )
}
