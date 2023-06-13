const express = require('express');
const { sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateNewSpot = [
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
    .isLength({ min: 0, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors
];

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
        });

          let reviewCount = await spot.countReviews()
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

router.post('/', validateNewSpot, async (req, res) => {
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
