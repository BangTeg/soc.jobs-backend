const {
  User,
  // Job,
  // Position,
  // Experience,
  // Application,
} = require("../db/models");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { handleError } = require("../utils/errorHandler"); // Import the error handling function
const { crudController } = require("../utils/crud");
const applicationController = require("./applicationController");

const attributes = { exclude: ["password"] };

module.exports = {
  attributes,
  getAll: async (req, res) => {
    return await crudController.getAll(User, {
      where: {},
      attributes,
      paginated: true,
    })(req, res);
  },
  getById: async (req, res) => {
    const id = req.params.id ?? req.user.id; // Use the ID from the route parameter or token's user Id
    return await crudController.getById(
      User,
      {
        attributes,
        // raw: true,
        // f:(async (req, res, rows) => {
        //   for (const [key,row] of Object.entries(rows)) {
        //     row["applications"] = await Application.findAll({
        //       where: { userId: id },
        //       include: applicationController.includeJob,
        //       raw: true,
        //       nest:true,
        //       attributes: applicationController.attributes,
        //     });
        //   }
        //   console.log(rows[0])
        //   return rows;
        // }),
      },
      id
    )(req, res);
  },
  update: async (req, res) => {
    const id = req.params.id ?? req.user.id; // Use the ID from the route parameter or token's user Id
    // const id = req.params.id; // Use the ID from the route parameter
    if (req.user.role !== "Admin")
      if (id != req.user.id) {
        return res.status(403).json({
          code: 403,
          status: "Forbidden",
          message: "You do not have permission to edit other's profile.",
        });
      }
    const data = req.body;
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
    return await crudController.update(
      User,
      { attributes },
      id,
      data
    )(req, res);
  },

  // Updated uploadAvatar function with Multer middleware
  uploadAvatar: async (req, res) => {
    try {
      // Check if a file was uploaded (Multer middleware adds 'file' to the request)
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          status: "Bad Request",
          message: "No file uploaded.",
        });
      }

      const { id } = req.user;

      // Update the user's avatar path in the database
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          code: 404,
          status: "Not Found",
          message: "User not found",
        });
      }

      // Remove the previous avatar file if it exists
      if (user.avatar) {
        const avatarPath = path.join(__dirname, `../src/avatar/${user.avatar}`);
        fs.unlinkSync(avatarPath);
      }

      user.avatar = req.file.filename; // Store the new avatar filename in the 'avatar' field
      await user.save();

      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Profile picture uploaded successfully.",
        avatarPath: user.avatar,
      });
    } catch (err) {
      return handleError(res, err);
    }
  },

  // Updated uploadCV function with Multer middleware
  uploadCV: async (req, res) => {
    try {
      // Check if a file was uploaded (Multer middleware adds 'file' to the request)
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          status: "Bad Request",
          message: "No file uploaded.",
        });
      }

      const { id } = req.user;

      // Update the user's CV path in the database
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          code: 404,
          status: "Not Found",
          message: "User not found",
        });
      }

      // Remove the previous CV file if it exists
      if (user.cv) {
        const cvPath = path.join(__dirname, `../src/cv/${user.cv}`);
        fs.unlinkSync(cvPath);
      }

      user.cv = req.file.filename; // Store the new CV filename in the 'cv' field
      await user.save();

      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "CV uploaded successfully.",
        cvPath: user.cv,
      });
    } catch (err) {
      return handleError(res, err);
    }
  },

  // getProfile: async (req, res) => {
  //   try {
  //     const profile = await User.findOne({
  //       where: { id: req.user.id },
  //       attributes: { exclude: ['password'] },
  //       // include: {
  //       //   model: Job,
  //       //   as: 'appliedJob',
  //       //   attributes: ['title', 'job_desc', 'logo', 'createdAt'],
  //       //   through: {
  //       //     attributes: ['status'],
  //       //   },
  //       // },
  //     });

  //     return res.status(200).json({
  //       code: 200,
  //       status: 'OK',
  //       message: 'Success get profile',
  //       data: {
  //         profile,
  //       },
  //     });
  //   } catch (err) {
  //     return handleError(res, err);
  //   }
  // },
};
