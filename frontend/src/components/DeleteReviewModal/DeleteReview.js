import React from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { getSpotById } from '../../store/spots';
import { deleteReview } from '../../store/reviews';
import './DeleteReview.css';


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
            <h2 className='delete-review-title'>
                Confirm Delete
            </h2>
            <h3 className='delete-review-description'>
                Are you sure you want to delete this review?
            </h3>
            <button className='review-delete-confirm' onClick={onClick}>Yes (Delete Review)</button>
            <button className='review-delete-deny' onClick={closeModal}>No (Keep Review)</button>
        </>
    )
}
