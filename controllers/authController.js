require("dotenv").config();

const {
  FE_PORT
} = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { handleError } = require("../utils/errorHandler");
const {
  sendAuthEmail,
  verifyAndInvalidateLatestToken,
} = require("../utils/emailer");
const { crudController } = require("../utils/crud");
const userController = require("./userController");
const fs = require("fs");
const ejs = require("ejs");

// Function to generate JWT token
const generateAuthToken = (user) => {
  const { id, name, email, role } = user;
  // console.log(user);
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d", // TODO : move to config
  });
};

const verifyEmailTemplate = fs.readFileSync("./src/emails/verifyEmail.ejs", {
  encoding: "utf-8",
});
const passwordResetTemplate = fs.readFileSync(
  "./src/emails/passwordReset.ejs",
  { encoding: "utf-8" }
);

// Render the emails
const getVerifyEmailText = (hostUrl, token, data) => {
  return ejs.render(verifyEmailTemplate, {
    ...data,
    path: hostUrl + `/auth/verify`,
    token,
  });
  // return html dengan `link verifikasi - ${hostUrl}/auth/verify/${token}`;
};
const getResetEmailText = (hostUrl, token, data) => {
  return ejs.render(passwordResetTemplate, {
    ...data,
    path: hostUrl + `/auth/reset`,
    token,
  });
  // return html dengan `link reset password - ${hostUrl}/auth/reset/${token}`;
};

// Send the emails using emailer module
const sendVerifyEmail = async (req, res, userData) => {
  const { email } = req.body;
  // const hostUrl = `${req.protocol}://${req.get("host")}`;
  const hostUrl = FE_PORT;
  return await sendAuthEmail(
    req,
    res,
    "Verification",
    userData,
    email,
    hostUrl,
    getVerifyEmailText
  );
};
const sendResetEmail = async (req, res) => {
  const hostUrl = `${req.protocol}://${req.get("host")}`;
  const { email } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: userController.attributes,
    raw: true,
  });
  if (user) {
    return await sendAuthEmail(
      req,
      res,
      "Password reset",
      user,
      email,
      hostUrl,
      getResetEmailText
    );
  }
  return handleError(res, {
    status: 404,
    message: "User not found",
  });
};

module.exports = {
  // Login logic
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // TODO : validation
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return handleError(res, { status: 404, message: "User not found" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      // const isPasswordMatch = password == user.password;
      console.log(`password ${password}, dbpassword ${user.password}`);

      if (!isPasswordMatch) {
        return handleError(res, { status: 401, message: "Wrong password" });
      }

      const token = generateAuthToken(user);
      return res.json({ message: "Login success", token, name: user.name });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // User Register logic
  userRegister: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // TODO : validation
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return handleError(res, {
          status: 409,
          message: "User already exists",
        });
      }

      // passwrod hashing
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const data = {
        name,
        email,
        password: hashedPassword,
        role: "User", // Assign the 'User' role
      };

      // send the verification email
      return await sendVerifyEmail(req, res, data);
      // // Assign the 'User' role to the user being registered
      // const user = await User.create(data);

      // const token = generateAuthToken(user);
      // return res.json({ message: "Register success", token, name: user.name });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Admin Register logic
  adminRegister: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // TODO : validation
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return handleError(res, {
          status: 409,
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const data = {
        name,
        email,
        password: hashedPassword,
        role: "Admin", // Assign the 'Admin' role
      };
      return await sendVerifyEmail(req, res, data);
      // Assign the 'Admin' role to the user being registered
      // const user = await User.create();

      // const token = generateAuthToken(user);
      // return res.json({
      //   message: "Admin Register success",
      //   token,
      //   name: user.name,
      // });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Logout logic
  logout: (req, res) => {
    res.json({ message: "Logout success" });
    // res.json({ message: "Logout success" });
  },

  // Password reset logic
  resetPassword: async (req, res) => {
    const { token } = req.params;
    console.log(token);
    if (token) {
      try {
        // verify and decode the token
        const { id, email } = jwt.verify(token, process.env.JWT_SECRET);

        // verify the token using tokenStore
        if (!verifyAndInvalidateLatestToken(email, token))
          return res.status(400).json({ message: "Token expired" });

        const { password } = req.body;
        // TODO : validation
        // passwrod hashing
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // update the user's password
        return await crudController.update(
          User,
          { attributes: userController.attributes },
          Number(id),
          { password: hashedPassword }
        )(req, res);
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    }
    return await sendResetEmail(req, res);
  },

  // Registration email verification logic
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    console.log(token);
    if (token) {
      try {
        // verify and decode the token
        const firstData = jwt.verify(token, process.env.JWT_SECRET);
        // verify the token using tokenStore
        if (!verifyAndInvalidateLatestToken(firstData.email, token))
          return res.status(400).json({ message: "Token expired" });

        // second data input
        // TODO : validation
        const secondData = {gender,address,contact} = req.body;
        
        // create the new user
        const user = await User.create({ ...firstData, ...secondData });
        // generate auth token for the new user
        const authToken = generateAuthToken(user);
        return res.json({
          message: "Register and email verification success",
          token: authToken,
          name: user.name,
        });
      } catch (error) {
        return handleError(res, error);
      }
    }
    return res.status(404).json({ message: "invalid token" });
    // return await sendVerifyEmail(req, res);
  },
};
