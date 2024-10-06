
const express = require('express');
const { locationControllerByAddress, locationControllerByCordinates, locationControllerNearBy, restaurantController } = require('../controller/locationController');

const route = express.Router();

route.post('/locationByaddress',locationControllerByAddress);
route.post('/locationByCordinates',locationControllerByCordinates);
route.post('/nearBy',locationControllerNearBy);
route.post('/createRestaurant',restaurantController)
module.exports= route;


