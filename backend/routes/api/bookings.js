const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//////////////////////////////////////////////////////////////////////

router.put('/:id/', restoreUser, requireAuth, async(req, res) => {
    let { startDate, endDate } = req.body;

    startDate = new Date(startDate)
    endDate = new Date(endDate)
    startDate = startDate.getTime()
    endDate = endDate.getTime()

    let booking = await Booking.findByPk(req.params.id);

    if(!booking) {
        res.status(404)
        return res.json({
          "message": "Booking couldn't be found"
        })
      }

    let bookingEnd = booking.endDate;
    bookingEnd = new Date(bookingEnd)
    bookingEnd = bookingEnd.getTime()

    let currentTime = new Date();
    currentTime = currentTime.getTime();



    if(booking.userId !== req.user.id) {
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    if(currentTime > bookingEnd) {
      res.status(403)
      return res.json({
        "message": "Past bookings can't be modified"
      })
    }


    let spot = await booking.getSpot();
    let spotBookings = await spot.getBookings();

    let conflict = false

    await Promise.all(
      spotBookings.map( async booking => {
        booking = booking.toJSON()

        let bookingStart = booking.startDate;
        let bookingEnd = booking.endDate;
        bookingStart = new Date(bookingStart)
        bookingEnd = new Date(bookingEnd)
        bookingStart = bookingStart.getTime()
        bookingEnd = bookingEnd.getTime()

        if(startDate >= bookingStart && startDate <= bookingEnd) {
          conflict = true
        }
        if(endDate >= bookingStart && endDate <= bookingEnd){
          conflict = true
        }

      })
    )

    if(conflict) {
        res.status(403)
        return res.json({
          "message": "Sorry, this spot is already booked for the specified dates",
          "errors": {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
          }
        });
      }

    if(startDate){
        booking.startDate = startDate;
    }
    if(endDate){
        booking.endDate = endDate;
    }

    await booking.save()


    res.json(booking)
  })

//////////////////////////////////////////////////////////////////////

router.get('/current', restoreUser, requireAuth, async(req, res) => {

    let bookings = await req.user.getBookings({
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"],
                },
            },
        ],
        group:["Booking.id", "Spot.id"]
    });

    let bookingsObj = await Promise.all(bookings.map(async booking => {
        booking = booking.toJSON()

        let previewImg = await SpotImage.findOne({
            where: {
                spotId: booking.Spot.id,
                preview: true
            }
          })

          booking.Spot.previewImage = previewImg.url;

          return booking
    }))


    res.json({Bookings: bookingsObj})
})

///////////////////////////////////////////////////////

module.exports = router;
