const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();



router.get('/current', restoreUser, requireAuth, async(req, res) => {

    let reviews = await req.user.getReviews({
        include: [
            {
                model: User,
                attributes: {
                  exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"]
                }
            },
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"],
                },
            },
            {
                model: ReviewImage,
                attributes: {
                    exclude: ["reviewId", "createdAt", "updatedAt"]
                },
                as: "ReviewImages"
            }
        ],
        group:["Review.id", "User.id", "Spot.id", "ReviewImages.id"]
    });

    let reviewsObj = await Promise.all(reviews.map(async review => {
        review = review.toJSON()

        let previewImg = await SpotImage.findOne({
            where: {
                spotId: review.Spot.id,
                preview: true
            }
          })

          review.Spot.previewImage = previewImg.url;

          return review
    }))


    res.json({Reviews: reviewsObj})
})


module.exports = router;
