const express = require('express');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate');
const app =express();
const methodOverride = require('method-override');
const ExpressError=require('./utils/ExpressError')
const path=require('path');
const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/reviews.js')
const session = require('express-session');
const flash = require('connect-flash');



mongoose.connect('mongodb://localhost:27017/Yelp-Camp',{
    //useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("No connection")
})

const db=mongoose.connection;

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(flash());


const sessionConfing={
    secret:'thisshouldbeabettersecreat',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfing))
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);



// const campground = require('./models/campground');
// const { title } = require('process');


  




app.get('/',(req,res)=>{
    res.render('home')
})




                                     

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404))
})
app.use((err,req,res,next)=>{
    // const {statusCode =500}=err;
    // 
    // 
    const {statusCode =500 }=err;
    if(!err.message) err.message='Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})

