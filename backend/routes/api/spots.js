const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');
const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({min: -90, max: 90})
    .withMessage("Latitude is not valid"),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors
];

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

/////////////////////////////////////////////////////////////

router.post('/:id/reviews', restoreUser, requireAuth, validateReview, async (req, res) => {
  let { review, stars } = req.body;

  let spot = await Spot.findByPk(req.params.id);

  let existingReview = await Review.findOne({
    where: {
      spotId: req.params.id,
      userId: req.user.id
    }
  });

  if (existingReview) {
    res.status(500);
    console.log("test")
    return res.json({
      "message": "User already has a review for this spot"
    });
  }

  if (!spot) {
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    });
  }

  let newReview = await spot.createReview({
    userId: req.user.id,
    spotId: req.params.id,
    review,
    stars
  });

  newReview = {
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt
  };

  res.status(201)
  res.json(newReview);
});

/////////////////////////////////////////////////////////////

router.get('/:id/bookings', restoreUser, requireAuth, async(req,res) => {
  let spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(req.user.id === spot.ownerId) {
    let spotBooking = await Booking.findAll({
      where: {
        spotId: parseInt(req.params.id)
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"]
          },
        },
      ],
      group: ["Booking.id", "User.id"]
    })

    res.json({Bookings: spotBooking})
  } else {
    let spotBooking = await Booking.findAll({
      where: {
        spotId: parseInt(req.params.id)
      },
      attributes: {
        exclude: [ "id", "userId", "createdAt", "updatedAt"]
      }
    })

    res.json({Bookings: spotBooking})
  }

})

////////////////////////////////////////////////////////////

router.get('/:id/reviews', async (req, res) => {

  let spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  let spotReviews = await Review.findAll({
    where: {
      spotId: parseInt(req.params.id)
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"]
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
    group:["Review.id", "User.id", "ReviewImages.id"]
  })

  res.json({Reviews: spotReviews})
})

////////////////////////////////////////////////////////////

router.post('/:id/images', restoreUser, requireAuth, validateReview, async (req, res) => {
  let { id } = req.params.id;
  let { url, preview } = req.body

  let spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403)
    return res.json({
      "message": "Forbidden"
    })
  }



  let newImage = await spot.createSpotImage(
    {
      url,
      preview
    }
  );

  newImage = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  };

  res.json(newImage);
});



////////////////////////////////////////////////////////////

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  let spot = await Spot.findByPk(req.params.id, {
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'reviewCount'],
        [Sequelize.fn("ROUND", Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), 1), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
        where: {
          spotId: id
        }
      },
      {
        model: SpotImage,
        attributes: {
          exclude: ["spotId", "createdAt", "updatedAt"]
        },
        as: "SpotImages"
      },
      {
        model: User,
        attributes: {
          exclude: ["username", "email", "hashedPassword", "createdAt", "updatedAt"]
        },
        as: "Owner"
      }
    ],
    group: ["Spot.id", "SpotImages.id", "Owner.id"]
  })

  if(!spot || spot.id !== parseInt(id)) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  res.json(spot)
})


///////////////////////////////////////////////////////////

router.put('/:id', restoreUser, requireAuth, validateSpot, async(req, res) => {
  let { address, city, state, country, lat, lng, name, description, price } = req.body
  let spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403)
    return res.json({
      "message": "Forbidden"
    })
  }

  if(address) {
    spot.address = address;
  }
  if(city) {
    spot.city = city;
  }
  if(state) {
    spot.state = state;
  }
  if(country) {
    spot.country = country;
  }
  if(lat) {
    spot.lat = lat;
  }
  if(lng) {
    spot.lng = lng;
  }
  if(name) {
    spot.name = name;
  }
  if(description) {
    spot.description = description;
  }
  if(price) {
    spot.price = price;
  }

  await spot.save()

  res.json(spot)
})


//////////////////////////////////////////////////////////

router.delete('/:id', restoreUser, requireAuth, async(req, res) => {
  let spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403)
    return res.json({
      "message": "Forbidden"
    })
  }

  await spot.destroy()

  res.json({
    "message": "Successfully deleted"
  })

})

///////////////////////////////////////////////////////////

router.get('/current', restoreUser, requireAuth, validateSpot, async(req, res) => {
  const spots = await req.user.getSpots();

  const spotsAvgRatingAndPrevImg = await Promise.all(
    spots.map( async spot => {
      let spotObj = spot.toJSON();

      let reviewAvg = await Review.sum('stars', {
        where: {
            spotId: spotObj.id
        }
      });

      let reviewCount = await spot.countReviews({
        where: {
            spotId: spotObj.id
        }
      })

      spotObj.avgRating = reviewAvg / reviewCount;

      let previewImg = await SpotImage.findOne({
        where: {
            spotId: spotObj.id,
            preview: true
        },
        attributes: ['url']
      });


      spotObj.previewImage = previewImg ? previewImg.url : null;

      return spotObj;
    })
  )

  res.json({Spots: spotsAvgRatingAndPrevImg})
})



///////////////////////////////////////////////////////////

router.get(
  '/',
  async (req, res) => {
    let spots = await Spot.findAll()

    const spotsWithAvgRating = await Promise.all(
        spots.map(async spot => {

          let spotObj = spot.toJSON();

          let reviewAvg = await Review.sum('stars', {
            where: {
                spotId: spotObj.id
            }
          })

          let reviewCount = await spot.countReviews({
            where: {
                spotId: spotObj.id
            }
          })

          spotObj.avgRating = reviewAvg / reviewCount;

          let previewImg = await SpotImage.findOne({
            where: {
                spotId: spotObj.id,
                preview: true
            },
            attributes: ['url']
          });


          spotObj.previewImage = previewImg ? previewImg.url : null;

          return spotObj;
        })
      );

    res.json({Spots: spotsWithAvgRating})
})

///////////////////////////////////////////////////////////////

router.post('/', restoreUser, requireAuth, validateSpot, async (req, res) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body

    let ownerId = req.user.id;

    let newSpot = await Spot.create({
      ownerId: ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })

    await newSpot.save();

    res.status(201)
    res.json(newSpot)
})



module.exports = router;
