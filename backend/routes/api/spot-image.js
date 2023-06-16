const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const booking = require('../../db/models/booking');
const router = express.Router();

router.delete('/:id', restoreUser, requireAuth, async(req, res) => {

    let spotImg = await SpotImage.unscoped().findByPk(req.params.id)

    console.log(spotImg)

    if(!spotImg) {
        res.status(404)
        return res.json({
            "message": "Spot Image couldn't be found"
          })
    }

    let spot = await spotImg.getSpot()


    console.log(Object.getOwnPropertyNames(SpotImage.prototype))
    console.log("spot", spot)

    if(spot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({
          "message": "Forbidden"
        })
      }

    await spotImg.destroy()

    res.json({
        "message": "Successfully deleted"
      })
})

module.exports = router;
