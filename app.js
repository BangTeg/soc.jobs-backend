require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const route = require('./route');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Catch body from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'secret'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use("/", route);

// Welcome page
app.get('/', (req, res) => {
  res.send('Welcome to SOC Jobs'); // Frontend landing page
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`Internal Server Error: ${err.message}`);
});

// Serve CV files from the 'cv' directory
app.use('/src/cv', express.static(path.join(__dirname, 'src/cv')));

// Listen to port
app.listen(port, () => {
  console.log(`SOC Jobs listening on port ${port}`);
});