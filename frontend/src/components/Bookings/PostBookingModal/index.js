import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseISO, eachDayOfInterval } from 'date-fns';
import { createBooking, getAllSpotBookings, getAllUserBookings } from "../../../store/bookings";
import { useModal } from "../../../context/Modal";
import { getSpotById } from "../../../store/spots";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PostBooking.css'


export function PostBookingModal({spotId}) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const { closeModal } = useModal();
    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))
    console.log('bookings', bookings)

    useEffect(() => {
        dispatch(getAllSpotBookings(spotId))
    }, [dispatch, spotId])

    // useEffect(() => {
    //     // Check for date conflict whenever selectedStartDate or selectedEndDate changes
    //     if (selectedStartDate && selectedEndDate) {
    //       const newBooking = {
    //         startDate: selectedStartDate,
    //         endDate: selectedEndDate,
    //       };

    //       const hasDateConflict = bookings.some(
    //         (booking) =>
    //           (newBooking.startDate >= parseISO(booking.startDate) &&
    //             newBooking.startDate <= parseISO(booking.endDate)) ||
    //           (newBooking.endDate >= parseISO(booking.startDate) &&
    //             newBooking.endDate <= parseISO(booking.endDate))
    //       );

    //       const handleStartDateChange = () => {
    //         const currentDate = new Date();
    //         const newStartDate = new Date(selectedStartDate)
    //         if (newStartDate < currentDate) {
    //           setErrors({ ...errors, startDate: "Start date cannot be before the current date" });
    //         }
    //       };

    //     const handleEndDateChange = () => {
    //         const currentDate = new Date();
    //         const newEndDate = new Date(selectedEndDate)
    //         if (newEndDate < currentDate) {
    //           setErrors({ ...errors, endDate: "End date cannot be before the current date" });
    //         }
    //       };


    //       setErrors({
    //         ...errors,
    //         startDate: hasDateConflict ? "Start date conflicts with an existing booking" : null,
    //         endDate: hasDateConflict ? "End date conflicts with an existing booking" : null,
    //       });
    //     }
    //   }, [selectedStartDate, selectedEndDate, bookings]);



    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log('StartDate', selectedStartDate)
        // console.log('EndDate', selectedEndDate)

        if (selectedStartDate && selectedEndDate) {

            const newBooking = {
                startDate: selectedStartDate,
                endDate: selectedEndDate
            }

            // const hasDateConflict = bookings.some(
            //     (booking) =>
            //       (newBooking.startDate >= new Date(booking.startDate) &&
            //        newBooking.startDate <= new Date(booking.endDate)) ||
            //       (newBooking.endDate >= new Date(booking.startDate) &&
            //        newBooking.endDate <= new Date(booking.endDate))
            //   );


            const backendErrors = await dispatch(createBooking(newBooking, spotId));
            console.log('backend', backendErrors)

            if(backendErrors) {
                setErrors(backendErrors);
            } else {
                return dispatch(getSpotById(spotId))
                    .then(() => dispatch(getAllSpotBookings(spotId)))
                    .then(() => dispatch(getAllUserBookings()))
                    .then(closeModal)
            }

            // if (hasDateConflict) {
            //     setErrors({
            //         ...errors,
            //         startDate: "Start date conflicts with an existing booking",
            //         endDate: "End date conflicts with an existing booking",
            //     });
            // } else {
            //     console.log(newBooking)
            //     return dispatch(createBooking(newBooking, spotId))
            //         .then(() => dispatch(getSpotById(spotId)))
            //         .then(() => dispatch(getAllSpotBookings(spotId)))
            //         .then(() => dispatch(getAllUserBookings()))
            //         .then(closeModal)
            // }
        }
    }

    const bookedStartDates = bookings.map((booking) => new Date(booking.startDate));
    const bookedEndDates = bookings.map((booking) => new Date(booking.endDate));

    console.log('Booked Start Dates:', bookedStartDates);
    console.log('Booked End Dates:', bookedEndDates);


    // Generate an array of all the dates between two dates
    const generateDateRange = (startDate, endDate) => {
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
        return dateRange.map(date => new Date(date));
    };

    const excludedDates = bookedStartDates.reduce((excluded, startDate, index) => {
        const endDate = bookedEndDates[index];
        return [...excluded, ...generateDateRange(startDate, endDate)];
    }, []);

    return (
        <div id='post-booking-modal-container'>
            {errors.message && <p className="error">{errors.message}</p>}
            {errors.errors?.startDate && <p className="error">{errors.errors?.startDate}</p>}
            {errors.errors?.endDate && <p className="error">{errors.errors?.endDate}</p>}
            <div id='start-end-container'>

                <div id='start-date-container'>
                    <div id='booking-date-title'>
                        StartDate
                    </div>
                    <div>
                        <DatePicker
                        selected={selectedStartDate}
                        onChange={(date) => setSelectedStartDate(date)}
                        excludeDates={excludedDates}
                        />
                    </div>
                    {/* {errors.startDate && <p className="error">{errors.startDate}</p>} */}
                </div>
                <div id='end-date-container'>
                    <div id='booking-date-title'>
                        EndDate
                    </div>
                    <div>
                        <DatePicker
                        selected={selectedEndDate}
                        onChange={(date) => setSelectedEndDate(date)}
                        excludeDates={excludedDates}
                        />
                    </div>
                    {/* {errors.endDate && <p className="error">{errors.endDate}</p>} */}
                </div>
            </div>
            <div id='post-booking-button'>
                <button type="submit" disabled={!selectedStartDate || !selectedEndDate} onClick={handleSubmit}>
                    Book
                </button>
            </div>
        </div>
    )
}
