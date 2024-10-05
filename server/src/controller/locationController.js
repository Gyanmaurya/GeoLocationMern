const {distanceCalculation, pricingValue} = require("../middleware/calculation");
const { getAddressByCordinates, getCordinatesByAddress } = require("../services/streetMapService");
const {Location} = require('../model/locationModdle')
const locationControllerByAddress = async( req, res, next)=>{
try {
     const {currentAddress, targetAddress} = req.body;
     const current = await getCordinatesByAddress(currentAddress);
     const target = await getCordinatesByAddress(targetAddress);
     console.log(current, target)
     const distanceKm = distanceCalculation(current, target);
     const priceRs = pricingValue(distanceKm);
     console.log(current, target, distanceKm, priceRs)
     res.status(200).json({
         current,
         target,
         distanceKm,
         priceRs 
     })
} catch (error) {
     res.status(500).json({ message: 'Error from locationControllerByAddress', error });
}

}

const locationControllerByCordinates = async( req, res, next)=>{
     try {
          const {userLocation, targetLocation} = req.body;
          const current = await getAddressByCordinates(userLocation.latitude, userLocation.longitude )
          const target = await getAddressByCordinates(targetLocation.latitude,targetLocation.longitude)
          console.log(current, target)
          const distanceKm = distanceCalculation(userLocation, targetLocation);
          const priceRs = pricingValue(distanceKm);
          res.status(200).json({
               current,
               target,
               distanceKm,
               priceRs 
           })
     } catch (error) {
          res.status(500).json({ message: 'Error from locationControllerByCordinates', error }); 
     }
     
     }

const locationControllerNearBy = async( req, res, next)=>{
     const { latitude, longitude } = req.body;
  
     try {
       const userAddress = await getAddressByCordinates(latitude, longitude);
   
     
       const locations = await Location.find({})
       
      
       const locationsWithDistance = locations.map((location) => {
         const distance = distanceCalculation({ latitude, longitude }, location);
         return {
           ...location.toObject(),
           distance,
         };
       });
   
       
       const nearbyLocations = locationsWithDistance.filter(location => location.distance <= 5);
       
       res.json({
         userAddress,
         nearbyLocations,
       });
     } catch (error) {
       res.status(500).json({ message: 'Error fetching locations', error });
     }
          
    }  
    
 const restaurantController = async(req,res,next)=>{
     try {
          const { name,latitude, longitude  } = req.body;
  
          // Validate input: all fields are required
          if (!name || !longitude || !latitude) {
              return res.status(400).json({
                  message: 'Please provide name, longitude, and latitude'
              });
          }
  
          // Create a new location instance (assuming Location is a Mongoose model)
          const locationData = new Location({
              name,
              latitude,
              longitude,
             
          });
  
          // Save the location to the database
          await locationData.save();
  
          // Respond with success message and saved location data
          res.status(200).json({
              message: 'Location saved successfully',
              location: locationData
          });
  
      } catch (error) {
          // Handle any errors that occur
          res.status(400).json({
              message: 'Error occurred in location controller',
              error: error.message
          });
      }
    
 }   

module.exports = {locationControllerByAddress, locationControllerByCordinates,locationControllerNearBy, restaurantController}