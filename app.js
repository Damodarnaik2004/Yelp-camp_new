const express = require('express');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate');
const app =express();
const methodOverride = require('method-override');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
const Campground = require('./models/campground')
mongoose.connect('mongodb://localhost:27017/Yelp-Camp',{
    //useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("No connection")
})

const db=mongoose.connection;

const path=require('path');
const campground = require('./models/campground');
const { title } = require('process');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',async(req,res)=>{
    
      const campgrounds = await Campground.find({});
       res.render('campgrounds/index',{campgrounds});

});

app.get('/campgrounds/new',async(req,res)=>{
    res.render("campgrounds/new");
})

app.post('/campgrounds',async(req,res)=>{
    const campground = new Campground({
        title:req.body.title,
        location:req.body.location,
        price:req.body.price,
        image:req.body.image,
        description:req.body.description
    });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

});




app.get('/campgrounds/:id',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground})
})


app.put('/campgrounds/:id',async(req,res)=>{
    const { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
   res.redirect('/campgrounds')  
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})