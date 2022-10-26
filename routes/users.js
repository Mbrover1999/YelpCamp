const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const passport = require('passport');
const {checkReturnTo} = require('../middleware');

const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        console.log(user);
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });

    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('register')

    }
}));

router.get('/login', (req, res) => {
    if(req.query.returnTo){
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
});

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    console.log(redirectUrl);
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "Not logged in");
        return res.redirect('/campgrounds')
    }
    req.logout(function (err) {
        if (err) {
            return next(error);
        }
        req.flash('success', "Goodbye");
        res.redirect('/campgrounds')
    });


});

module.exports = router;