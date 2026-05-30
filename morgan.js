const express = require('express');
const app = express();
const morgan = require('morgan');

//morgan('tiny');

/*app.use((req, res, next) => {
    //Use will run on every single request not matter what function is called.
    //that is for every browsing it will be displayed in the terminal
    console.log("HEY HEY!!");
    //try with return next();
    next();//as it will get stopped here so we are using next to go further not getting stopped
    console.log("First Middleware after next");
})*/

const AppError = require('./AppError');

app.use(morgan('tiny'));
app.use((req, res, next)=> {
    req.reqestTime = Date.now();
    console.log(req.method, req.path);
    next();
})

app.use(morgan('tiny'));

// app.use((req, res, next)=> {
//     const {password} = req.query;
//     if(password === 'chicken') {
//         next();
//     }
//     console.log("Sorry Buddy!!");
// })


const verifyPassword = ((req, res, next)=> {
    const {password} = req.query;
    if(password === 'chicken') {
        next();
    }
    throw new AppError('Password Required!!', 401);
    //res.send("Sorry Buddy!!");//Don't give console.
})

app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.reqestTime}`);
    res.send('HOME PAGE!!');//If the code is without next these functions won't run..
})

app.get('/dogs/', (req, res) => {
    console.log(`REQUEST DATE: ${req.reqestTime}`);
    res.send('BOW BOW!!');
})

app.get('/secrets', verifyPassword, (req, res)=> {
    res.send("Hey I got the secret request!!")
})

app.get('/admin', (req, res)=> {
    throw new AppError('You are not an admin!!', 403);
})

app.get('/error', (req, res)=> {
    chicken.fly();//just for a error format
})

/*app.use((err, req, res, next)=> {
    console.log('*****');
    console.log('***ERROR***');
    console.log('*****');
})*/

app.use((err, req, res, next)=> {//Express knows it’s for errors because it has 4 arguments
    const {status=500, message='Something went wrong!!!'} = err;//default method for sending error
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('App is running in localHost: 3000');
})

//error: (err, req, res, next)