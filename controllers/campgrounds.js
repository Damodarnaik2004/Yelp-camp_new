const Campground = require('../models/campground')
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
var mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken:mapBoxToken});
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("campgrounds/new");
  }

module.exports.createCampground= async(req,res,next)=>{
  
    // if(!req.body.title && !req.body.location && !req.body.price && !req.body.image &&  !req.body.description) throw new ExpressError('Invalid Campground Data',400)
     // if(!req.body.campground) throw new ExpressError('Invaild Campground data',400);
      
     const geoData = await geoCoder.forwardGeocode({
          query:req.body.campground.location,
          limit:1
     }).send()
    
     //res.send(geoData.body.features[0].geometry.coordinates)
     const campground = new Campground(req.body.campground);
     campground.geometry = geoData.body.features[0].geometry;
     campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
     campground.author = req.user._id;//this will be the user id of whoever logged in
     
     await campground.save();
     console.log(campground);
     req.flash('success','Successfully made a new campground!')
     res.redirect(`/campgrounds/${campground._id}`);
   
    //  res.send("ok!!!!!!!!!")
}

module.exports.showCampground=  async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate(
      {  path:'reviews',
         populate:{
           path:'author'
         }
      
      }).populate('author');
   // console.log(campground)
     if(!campground){
      req.flash('error','Cannot find that campground');
      return res.redirect('/campgrounds')
     }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
      req.flash('error', 'Cannot find that campground');
      return res.redirect('/campgrounds');
  }

  res.render('campgrounds/edit', { campground });
};

               
  module.exports.updateCampground = async(req,res)=>{
    const { id } = req.params;
    console.log(req.body)
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
   campground.images.push(...imgs);
   await campground.save()
   if(req.body.deleteImages){
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
     await campground.updateOne({ $pull: {images:{filename:{$in:req.body.deleteImages}}}})
    // console.log(campground);
   }
   
   req.flash('success','Successfully Updated campground!')
   res.redirect(`/campgrounds/${campground._id}`)
  }

 module.exports.deleteCampground= async(req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground!')
   res.redirect('/campgrounds')  
  }