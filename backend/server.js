require('dotenv').config();
require('./passport');
require('./redisClient');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoute = require('./Routes/auth');
const mapCaptureRoutes = require('./Routes/mapCaptureRoutes');
const app = express();

app.enable('trust proxy');

app.use(
  cookieSession({
    name: "session",
    keys: ["test"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production', // only send cookies over HTTPS
    sameSite: 'none', // to ensure cookies are sent in cross-site requests
    secure:true
  })
);
app.use(express.json());

const uri = process.env.MONGODB_URI || "your_mongo_uri_here";
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));



app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL, // Set this to your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow credentials (cookies) to be sent
  })
);


app.use("/auth", authRoute);
app.use("/map", mapCaptureRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
