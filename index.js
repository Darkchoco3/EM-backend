require('dotenv/config');
const express = require('express');
const app = express();
const port = process.env.PORT  || 5780 ;
const connect = require('./config/Db');
const authRoute = require('./route/authRoute');
const userRoute = require ("./route/userRoute")
const cors = require("cors")
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

// custom middlewares
app.use(fileUpload({useTempFiles: true}));
app.use(express.json())
app.use(cors())
// API's
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// server and Db CONNECTION
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Em-server is connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log('can not connect to the EM server');
    }
  })
  .catch((error) => {
    console.log('invalid database connection...', error);
  });

// routes
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Em server is live' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'route doesnt exist' });
});