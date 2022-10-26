const experess = require('express');
const router = experess.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../modules/campgorund');
const Review = require('../modules/review')

const { validatedReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../modules/review');



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', "Successfully deleted the Review!")
    res.redirect(`/campgrounds/${id}`)
}));



router.post('/', validatedReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Created a new Review!")
    res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;