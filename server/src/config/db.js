
const mongoose = require('mongoose');
const connectDB = async()=>{
try {
   return  await mongoose.connect('mongodb://localhost:27017/locationDB').then(()=>{
          console.log('Database connected successfully')
     })
} catch (error) {
     console.log('Somethink went wrong in database', error);
     process.exit(1);
}
}

module.exports = connectDB;

