const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

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
