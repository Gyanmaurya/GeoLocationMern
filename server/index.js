const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
const locationRoute = require('./src/route/locationRoute')
require('dotenv').config()
app.use(express.json())
app.use(cors({
     origin:'http://localhost:5173',
     methods:'GET,POST,PUT,DELETE',
     Credentials:true
}))
const PORT = process.env.PORT;

// app.use('')



app.use('/api/v1', locationRoute )

app.listen(PORT, async()=>{
     try {
     await connectDB()
     console.log(`Server connected at port ${PORT}`)
     } catch (error) {
          console.log('somethink went wrong in server connection')
          process.exit(1)
     }
})

