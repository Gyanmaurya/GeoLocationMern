const axios = require('axios');

const  getCordinatesByAddress = async(address)=>{
   
     try {
             const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=2`)

             const data = response.data[0];
             if(!data){
               throw new Error ('Address not found')
             }

             return {
               latitude:parseFloat(data.lat),
               longitude:parseFloat(data.lon)
             }
              

     } catch (error) {
          console.error('Error fetching coordinates from address:', error);
          throw error;
     }

} 


const getAddressByCordinates = async(latitude, longitude)=>{
     
     try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          return response.data.display_name;
        } catch (error) {
          console.error('Error fetching address:', error);
         throw error;
        }

} 


module.exports = {getAddressByCordinates, getCordinatesByAddress }