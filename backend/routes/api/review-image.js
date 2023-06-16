const express = require('express');
const { Sequelize, Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const booking = require('../../db/models/booking');
const router = express.Router();

router.delete('/:id', restoreUser, requireAuth, async(req, res) => {

    let reviewImg = await ReviewImage.findByPk(req.params.id)

    if(!reviewImg) {
        res.status(404)
        return res.json({
            "message": "Review Image couldn't be found"
          })
    }

    let review = await reviewImg.getReview()

    
    console.log(review)

    if(review.userId !== req.user.id) {
        res.status(403)
        return res.json({
          "message": "Forbidden"
        })
      }

    await reviewImg.destroy()

    res.json({
        "message": "Successfully deleted"
      })
})

module.exports = router;
