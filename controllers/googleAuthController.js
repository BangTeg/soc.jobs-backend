require('dotenv').config();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');
const { handleError } = require('../utils/errorHandler');

// Function to generate JWT token
// TODO : move functiont auth middleware
const generateAuthToken = (user) => {
  const { id, name, email, role } = user;
  // console.log(user);
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d", // TODO : move to config
  });
};

module.exports = {
  // Endpoint google login
  googleLogin: passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/auth/google/protected',
    failureRedirect: '/auth/google/failure',
  }),

  // Endpoint called after successful Google authentication
  googleProtected: async (req, res) => {
    try {
      console.log(req.user);
      const name = req.user.displayName;
      const email = req.user.emails[0].value; // Corrected email extraction
      const avatar = req.user.photos[0].value; // Corrected avatar extraction
      const gender = req.user.gender; // Add gender extraction

      // Find or create the user based on Google profile information
      const [user, isCreated] = await User.findOrCreate({
        where: { email },
        defaults: { name, avatar, gender, role: 'User' }, // Assign the 'User' role
      });
      console.log(isCreated);
      const token = generateAuthToken(user);
      // return res.redirect(`/auth/google/success/${token}`);

      return res.json({
        message: 'Login success',
        token,
      });
      
    } catch (error) {
      return handleError(res, error); // Handle errors using the handleError function
    }
  },

  // Endpoint called after successful Google authentication
  googleSuccess: (req, res) => {
    res.send({
      message: "Login success",
      token: req.params.token
    });
  },

  // Endpoint called when Google authentication fails
  googleFailure: (req, res) => {
    res.send('Failed to login');
  },

  // Test endpoint for authentication with Google
  testGoogleAuth: (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  },

  // Callback route for Google to redirect to after authentication
  // UNUSED
  // googleCallback: (req, res) => {
  //   console.log('callback')
  //   passport.authenticate('google', async (err, user, info) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).send('Internal Server Error');
  //     }

  //     if (!user) {
  //       return res.status(401).send('Google authentication failed');
  //     }

  //     // If user is authenticated, generate a JWT token
  //     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  //       expiresIn: '1d', // TODO : move to config
  //     });

  //     // Redirect to a success page with the token
  //     return res.redirect(`/auth/google/success/${token}`);
  //   })(req, res);
  // },
};
