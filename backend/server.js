const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoute = require('./Routes/auth');
const mapCaptureRoutes = require('./Routes/mapCaptureRoutes');

const app = express();
require('dotenv').config();
require('./passport');
require('./redisClient');

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,  // Make sure this matches http://localhost:3000
  methods: "GET,POST,PUT,DELETE",
  credentials: true,  // Allow credentials (cookies) to be sent
}));

app.use(express.json());

const uri = process.env.MONGODB_URI || "your_mongo_uri_here";
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

app.use(
  cookieSession({
    name: "session",
    keys: ["test"],
    maxAge: 10000,
    secure: true,  // Ensure the cookie is only sent over HTTPS
    sameSite: 'None'  // Allow cross-site requests
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/map", mapCaptureRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
