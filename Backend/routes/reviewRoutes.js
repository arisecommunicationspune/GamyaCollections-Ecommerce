const express = require('express')
const router = express.Router()
const {addReview,getReview} = require('../controller/reviewController.js')

router.post('/add',addReview);
router.get('/',getReview);

module.exports = router;