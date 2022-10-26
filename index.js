const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./modules/user');


const ExpressError = require('./utils/ExpressError')


//routs:
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require ('./routes/users')


main().catch(err => console.log(`Could not connect to database: ${err}`));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Connection with the data base made!");

};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
});

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
  res.render("home")
});


app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  // if(err){
  //   req.flash('error', "Campground not found");
  //   return res.redirect('/campgrounds')
  // }
  if (!err.message) err.message = "Something went wrong..."
  res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
  console.log("Listening to port 3000")
});
