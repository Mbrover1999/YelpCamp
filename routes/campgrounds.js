const experess = require('express');
const router = experess.Router();
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync');


const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validatedCampground } = require('../middleware');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validatedCampground, catchAsync(campgrounds.createCampground));


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatedCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;