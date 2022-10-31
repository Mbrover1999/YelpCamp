const experess = require('express');
const router = experess.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

const { validatedReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));

router.post('/', validatedReview, isLoggedIn, catchAsync(reviews.creatReview));

module.exports = router;