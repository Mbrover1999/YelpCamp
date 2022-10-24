const experess = require('express');
const router = experess.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../modules/campgorund');
const { campgorundSchema} = require('../schemas.js')


const validatedCampground = (req, res, next) => {
    const { error } = campgorundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validatedCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`campgrounds/${campground._id}`);

}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});

}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    req.flash('success', "Successfully updated Campground!")
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id', validatedCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);

}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the Campground!")
    res.redirect('/campgrounds')
}));

module.exports = router;