import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch} from 'react-redux';
import { deleteSpot } from '../../store/spots';
import './DeleteSpot.css'

export const DeleteSpotModal = ({spot}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    console.log(spot)
    const onClick = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpot(spot))
        .then(closeModal)
        .catch(async (res) => {console.log(res)});
    }

    return (
        <>
            <h2 className='delete-spot-title'>
                Confirm Delete
            </h2>
            <h3>
                Are you sure you want to delete this spot from the listings?
            </h3>
            <div id='delete-spot-button-container'>
            <button className='delete-spot-confirm' onClick={onClick}>Yes (Delete Spot)</button>
            <button className='delete-spot-deny' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </>
    )
}
