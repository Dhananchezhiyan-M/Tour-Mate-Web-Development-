if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

//const dbUrl = 'mongodb+srv://our-first-user:<your_actual_password>@cluster.zm3nqjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');//this is for boots-trap
const session = require('express-session');
const Joi = require('joi');//this will be used in the field of errors
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');

const dbUrl = process.env.DB_URL;

//New version.

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes= require('./routes/reviews');

/*
mongoose.connect('mongodb://127.0.0.1:27017/yel-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error:"));
db.once("open", () => {
    console.log("Database connected");
})
*/
mongoose.connect(dbUrl) // used to connect with the cloud mongoDB database
//mongoose.connect('mongodb://127.0.0.1:27017/yel-camp'); // connect with the local host mongoDB database

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error:"));
db.once("open", () => {
    console.log("Database connected");
})
//Campground -  is for schema...
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');//make ejs as the template engine to render dynamic HTML
app.set('views', path.join(__dirname, 'views'));//My EJS templates are stored inside the views folder.


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));//we mentioned here, so no need to mention the folder name in the boilerplate.

const MongoStore = require('connect-mongo');
const { name } = require('ejs');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // update the session only once in 24 hours
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'session',//default is connect.sid
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Add this **after** session
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());//the passport will inititlaize the authentication.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//Registers the Local Strategy (username & password login) with Passport.
//“When someone logs in, check their username and password using User.authenticate().”

passport.serializeUser(User.serializeUser());//defines how to store user data in the session.
passport.deserializeUser(User.deserializeUser());

// Make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//For username and password
app.get('/fakeUser', async(req, res) => {
    const user = new User({email: 'dhana@gmail.com', username: 'Dhana'});//creates a new object using mongoose.
    const newUser = await User.register(user, 'chicken');//seperate one for creating password, after creating the object.
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);//So we can remove the name (campgrounds)

app.get('/', (req, res) => {
    res.render('home');
})
//ctrl+shift+i -> open copilot.


/*app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log({ campgrounds });
    res.render('campgrounds/index', { campgrounds })
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.post('/campgrounds', catchAsync(async (req, res, next) => {

    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    })//this will be checked before getting connected with mongoose
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(e => e.message).join(','), 400);
    }
    console.log(result);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');//join
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    console.log(req.body.campground);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));*/

/*app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))*/

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(4000, () => {
    console.log('Serving on port 4000');
})


/*app.post('/campgrounds', async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

})*/

/*
npm install express@5.1.0
npm install ejs@3.1.10
npm install ejs-mate@4.0.0
npm install express-ejs-layouts@2.5.1
npm install method-override@3.0.0
npm install mongoose@8.15.1
npm install morgan@1.10.0
*/

//node app.js
//app.all(/(.*)/, (req, res, next) => {


//In mongosh (show dbs)
//In mongoose the enum represent the value that only have to present no other than that is included


//Don't need to store the salt in different location.
// const bcrypt = require('bcrypt'); //for comparing passwords
// const hashPassword = async(pw) => {
//     const salt = await bcrypt.genSalt(6);//generates salt
//     const hash = await bcrypt.hash(pw, salt);//generates hash password
//     console.log(salt);
//     console.log(hash);
// }

// hashPassword('monkey');

// Serialize	Store the user ID (or unique info) into the session (usually after login).
// Deserialize	Use the ID stored in the session to look up the full user object from the database on every request.