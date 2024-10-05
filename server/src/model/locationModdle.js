
const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
     name:{type:String },
     latitude:{type:Number},
     longitude:{type: Number }
    
})

const Location = mongoose.model('locations', locationSchema);
module.exports = {Location};