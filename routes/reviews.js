const experess = require('express');
const router = experess.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../modules/campgorund');
const Review = require('../modules/review')
const { reviewSchema } = require('../schemas.js')



const validatedReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', "Successfully deleted the Review!")
    res.redirect(`/campgrounds/${id}`)
}));



router.post('/', validatedReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Created a new Review!")
    res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;