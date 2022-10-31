const User = require('../modules/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.renderLogin =  (req, res) => {
    if(req.query.returnTo){
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
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


}