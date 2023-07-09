import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { deleteReview } from '../../store/reviews';


export const DeleteReviewModal = ({review, spotId}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onClick = async (e) => {
        e.preventDefault();
        await dispatch(deleteReview(review))
        .then (() => dispatch(getSpotById(spotId)))
        .then(closeModal)
    }

    return (
        <>
            <h2>
                Confirm Delete
            </h2>
            <h3>
                Are you sure you want to delete this review?
            </h3>
            <button onClick={onClick}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </>
    )
}
