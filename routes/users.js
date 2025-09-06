const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;

/*const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;//Extracts email, username, and password from the submitted form.
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);//User.register(user, password) uses Passport-Local-Mongoose to:
        req.login(registeredUser, err => {
            if (err) return next(err);
            //HTTP is stateless — once you redirect a user (like after a form submission), all request data is gone.
            //You can't simply res.send('success') after a redirect. That’s where flash helps:
            //Hash the password
            //Save the user to the DB
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {//log in immediately after registration
    res.render('users/login');
})

router.post('/login',
    storeReturnTo, // ⬅️ Grabs returnTo before Passport wipes session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl); // ✅ now works as expected
    });

// Check the username and password.

// If invalid: redirect to /login with a flash error.

// If valid: move to the next middleware (the one below).S



//new version of passport
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
});

module.exports = router;
*/

/*router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
});*/