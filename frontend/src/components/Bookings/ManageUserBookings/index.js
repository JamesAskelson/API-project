import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUserBookings } from "../../../store/bookings"
import OpenModalButton from '../../OpenModalButton'
import "./UserBookings.css"



export const UserBookingsIndex = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => Object.values(state.session.user))
    const bookings = useSelector(state => Object.values(state.bookings.userBookings))
    console.log('bookings', bookings)

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`
    }

    useEffect(() => {
        dispatch(getAllUserBookings());
    }, [dispatch])

    return (
        <div id='manage-bookings-main-container'>
            <div id='manage-bookings-title'>
                <h1>Manage your Trips</h1>
            </div>
            <div id='manage-bookings-container'>
                {bookings?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((booking) => (

                    <div id='individual-booking-container' key={booking.id}>
                        {console.log('booking', booking)}
                            <div id='individual-booking-img'>
                                <img src={booking?.Spot?.previewImage} alt={`Spot ${booking?.Spot?.name} preview`} />
                            </div>
                            <div id='individual-booking-line'>
                            </div>
                            <div id='individual-booking-info-container'>
                                <div id='individual-booking-name'>
                                    {booking.Spot.name}
                                </div>

                                <div id='individual-booking-date'>
                                    {formatDate(booking?.startDate)} - {formatDate(booking?.endDate)}
                                </div>
                            </div>

                    </div>

                    ))}
            </div>
        </div>
    )
}
