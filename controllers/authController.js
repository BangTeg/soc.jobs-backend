const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');
const { handleError } = require('../utils/errorHandler');

// Function to generate JWT token
const generateAuthToken = (user) => {
  const { id, name, email, role } = user;
  console.log(user);
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

module.exports = {
  // Login logic
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return handleError(res, { status: 404, message: 'User not found' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return handleError(res, { status: 401, message: 'Wrong password' });
      }

      const token = generateAuthToken(user);
      return res.json({ message: 'Login success', token, name: user.name });
    } catch (error) {
      return handleError(res, error);
    }
  },

// User Register logic
userRegister: async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return handleError(res, { status: 409, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Assign the 'User' role to the user being registered
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'User', // Assign the 'User' role
    });

    const token = generateAuthToken(user);
    return res.json({ message: 'Register success', token, name: user.name });
  } catch (error) {
    return handleError(res, error);
  }
},

// Admin Register logic
adminRegister: async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return handleError(res, { status: 409, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Assign the 'Admin' role to the user being registered
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Admin', // Assign the 'Admin' role
    });

    const token = generateAuthToken(user);
    return res.json({ message: 'Admin Register success', token, name: user.name });
  } catch (error) {
    return handleError(res, error);
  }
},


  // Logout logic
  logout: (req, res) => {
    res.json({ message: 'Logout success' });
  }
};
