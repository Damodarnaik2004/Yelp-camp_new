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
        const price=Math.floor(Math.random()*10)*1000
        const c = new Campground({
            location: `${randomCity.City}, ${randomCity.State}`,
            title:`${sample(descriptors)},${sample(places)}`,
            image:"https://source.unsplash.com/collection/483251",
            description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. In explicabo excepturi aliquid perferendis fugit corrupti ipsa quod fugiat asperiores fuga earum, adipisci similique provident iste suscipit libero dolorum unde consequatur?",
            price:price
        });
    await c.save();
    }

}

seedDB().then(()=>{
    mongoose.connection.close();
});


