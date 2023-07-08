import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSpot } from '../../store/spots';

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
            <h2>
                Confirm Delete
            </h2>
            <h3>
                Are you sure you want to delete this spot from the listings?
            </h3>
            <button onClick={onClick}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </>
    )
}
