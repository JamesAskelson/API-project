const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const booking = require('../../db/models/booking');
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
    .isFloat({min: 0})
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



////////////////////////////////////////////////////////////

router.post('/:id/bookings', restoreUser, requireAuth, async(req, res) => {
  let { startDate, endDate } = req.body;

  let currentDate = new Date();
  currentDate = currentDate.getTime()
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  startDate = startDate.getTime()
  endDate = endDate.getTime()

  if (startDate < currentDate || endDate < currentDate) {
    res.status(400);
    return res.json({
      "message": "Start date and end date must be in the future"
    });
  }

  // console.log(startDate, endDate)

  let spot = await Spot.findByPk(req.params.id);

  if(!spot) {
    res.status(404)
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId === req.user.id) {
    res.status(403)
    return res.json({
      "message": "Forbidden"
    })
  }

  let spotBookings = await spot.getBookings()

  let errors = []

  await Promise.all(
    spotBookings.map( async booking => {
      booking = booking.toJSON()

      let bookingStart = booking.startDate;
      let bookingEnd = booking.endDate;
      bookingStart = new Date(bookingStart)
      bookingEnd = new Date(bookingEnd)
      bookingStart = bookingStart.getTime()
      bookingEnd = bookingEnd.getTime()

      errors = []
      if(startDate >= bookingStart && startDate <= bookingEnd) {
        errors.push(1)
      }
      if(endDate >= bookingStart && endDate <= bookingEnd){
        errors.push(1)
      }
    })
  )

  if(errors.length > 0) {
    res.status(403);
    return res.json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    });
  }


  let newBooking = await spot.createBooking({
    spotId: req.params.id,
    userId: req.user.id,
    startDate,
    endDate
  })

  newBooking = {
    id: newBooking.id,
    spotId: newBooking.userId,
    userId: newBooking.spotId,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    createdAt: newBooking.createdAt,
    updatedAt: newBooking.updatedAt
  };


  res.json(newBooking)
})

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
    // console.log("test")
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

router.post('/:id/images', restoreUser, requireAuth, async (req, res) => {
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

///////////////////////////////////////////////////////////

router.get('/current', restoreUser, requireAuth, async(req, res) => {
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

////////////////////////////////////////////////////////////

router.get('/:id', async (req, res) => {
  let { id } = req.params;

  id = parseInt(id)

  let spot = await Spot.findByPk(req.params.id, {
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'reviewCount'],
        [
          Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
          'avgRating',
        ],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
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

  // console.log(spot)

  if(!spot) {
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

router.get(
  '/',
  async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let pagination = {}

    if(!page) {
      page = 1
    }
    if(!size) {
      size = 20
    }
    page = parseInt(page);
    size = parseInt(size);

    if(page > 10) {
      page = 10
    }
    if(size > 20) {
      size = 20
    }

    if(page >= 1 && size >= 1){
      pagination.limit = size
      pagination.offset = size * (page - 1)
    }

    let errors = {}
    errors.message = "Bad Request"
    errors.errors = {}
    let where = {}

    //////////////////////////////////
    if (minLat && maxLat) {
      where.lat = {
        [Op.between]: [minLat, maxLat],
      };
    } else if (minLat) {
      where.lat = {
        [Op.gte]: minLat,
      };
    } else if (maxLat) {
      where.lat = {
        [Op.lte]: maxLat,
      };
    }
    //////////////////////////////////
    if (minLng && maxLng) {
      where.lng = {
        [Op.between]: [minLng, maxLng],
      };
    } else if (minLng) {
      where.lng = {
        [Op.gte]: minLng,
      };
    } else if (maxLng) {
      where.lng = {
        [Op.lte]: maxLng,
      };
    }
    //////////////////////////////////
    if (minPrice && maxPrice) {
      where.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    } else if (minPrice) {
      where.price = {
        [Op.gte]: minPrice,
      };
    } else if (maxPrice) {
      where.price = {
        [Op.lte]: maxPrice,
      };
    }

    //////////////////////////////////

    // console.log(page)
    // console.log(size)

    if (page) {
      if (page < 1) {
        errors.errors.page = "Page must be greater than or equal to 1";
      }
    } else {
      errors.errors.page = "Page must be greater than or equal to 1";
    }
    if (size) {
      if (size < 1) {
        errors.errors.size = "Size must be greater than or equal to 1";
      }
    } else {
      errors.errors.size = "Size must be greater than or equal to 1";
    }
    if(maxLat) {
      if(isNaN(maxLat) || maxLat > 90) {
        errors.errors.maxLat = "Maximum latitude is invalid"
      }
    }
    if(minLat) {
      if(isNaN(minLat) || minLat < -90) {
        errors.errors.minLat = "Minimum latitude is invalid"
      }
    }
    if(minLng) {
      if(isNaN(minLng) || minLng < -180) {
        errors.errors.minLng = "Minimum longitude is invalid"
      }
    }
    if(maxLng) {
      if(isNaN(Number(maxLng)) || maxLng > 180) {
        errors.errors.maxLng = "Minimum longitude is invalid"
      }
    }
    if(minPrice) {
      if(isNaN(Number(minPrice)) || minPrice < 0) {
        errors.errors.minPrice = "Minimum price must be greater than or equal to 0"
      }
    }
    if(maxPrice) {
      if(isNaN(Number(maxPrice)) || maxPrice < 0) {
        errors.errors.maxPrice = "Maximum price must be greater than or equal to 0"
      }
    }

    if (Object.keys(errors.errors).length > 0) {
      res.status(400);
      return res.json(errors);
    }

    ///////////////////////////////

    let spots = await Spot.findAll({
      where,
      ...pagination
    })
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

          spotObj.avgRating = (reviewAvg / reviewCount).toFixed(1);

          if(isNaN(spotObj.avgRating)) {
            spotObj.avgRating = 0
          }

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

    res.json({
      Spots: spotsWithAvgRating,
      page,
      size
    })
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


    res.json(newSpot)
})



module.exports = router;
