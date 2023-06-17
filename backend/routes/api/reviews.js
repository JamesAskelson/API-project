const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check('stars')
      .exists({ checkFalsy: true })
      .isFloat({min: 1, max: 5})
      .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
  ];

router.post('/:id/images', restoreUser, requireAuth, async (req, res) => {
    let { id } = req.params.id;
    let { url } = req.body

    let review = await Review.findByPk(req.params.id)

    if(!review) {
      res.status(404)
      return res.json({
        "message": "Review couldn't be found"
      })
    }

    if(review.userId !== req.user.id) {
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    let totalReviewImages = await review.getReviewImages()

    if(totalReviewImages.length >= 10) {
        res.status(403)
        return res.json({
            "message": "Maximum number of images for this resource was reached"
        })
    }

    let newReview = await review.createReviewImage(
      {
        url
      }
    );

    newReview = {
      id: newReview.id,
      url: newReview.url,
    };

    res.json(newReview);
  });

  ///////////////////////////////////////////////////////////////////////

  router.put('/:id', restoreUser, requireAuth, validateReview, async(req, res) => {
    let { review, stars } = req.body;
    let currReview = await Review.findByPk(req.params.id)

    if(!currReview) {
      res.status(404)
      return res.json({
        "message": "Review couldn't be found"
      })
    }

    if(currReview.userId !== req.user.id) {
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    if(review) {
        currReview.review = review;
    }
    if(stars) {
        currReview.stars = stars;
    }


    await currReview.save()

    res.json(currReview)
  })

  //////////////////////////////////////////////////////////////////////


  router.delete('/:id', restoreUser, requireAuth, async(req, res) => {
    let review = await Review.findByPk(req.params.id)

    if(!review) {
      res.status(404)
      return res.json({
        "message": "Review couldn't be found"
      })
    }

    if(review.userId !== req.user.id) {
      res.status(403)
      return res.json({
        "message": "Forbidden"
      })
    }

    await review.destroy()

    res.json({
      "message": "Successfully deleted"
    })

  })


  /////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////




module.exports = router;
