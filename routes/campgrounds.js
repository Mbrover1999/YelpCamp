const experess = require('express');
const router = experess.Router();

const catchAsync = require('../utils/catchAsync');


const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validatedCampground } = require('../middleware');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validatedCampground, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validatedCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

module.exports = router;