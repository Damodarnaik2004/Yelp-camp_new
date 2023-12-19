const cities=require('./indianCities')
const {places,descriptors}=require('./seedHelpers')
const mongoose = require('mongoose');

const Campground = require('../models/campground')
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

const sample= array=>array[Math.floor(Math.random()*array.length)];


const seedDB=async()=>{
    await Campground.deleteMany({});
  
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const randomCity = cities[randomIndex];
        const c = new Campground({
            location: `${randomCity.City}, ${randomCity.State}`,
            title:`${sample(descriptors)},${sample(places)}`
        });
    await c.save();
    }

}

seedDB().then(()=>{
    mongoose.connection.close();
});


