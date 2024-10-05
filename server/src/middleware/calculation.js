const goelib = require('geolib');

const distanceCalculation = (userLocation, targetLocation)=>{
     const distance = goelib.getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
)

return distance/1000;
}

const pricingValue = (distance)=>{
     if (distance <= 2) return 20;
     if (distance > 2 && distance <= 5) return 60;
     return 100;
}

module.exports = {distanceCalculation, pricingValue};