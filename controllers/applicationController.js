const { Application, Job, User, Position, Experience, Type } = require("../db/models");
const { crudController } = require("../utils/crud");
const { handleError } = require("../utils/errorHandler");
const userController = require("./userController");
const jobController = require("./jobController");
const fs = require("fs");
const ejs = require("ejs");
const { mailOptions } = require("../config/emailerConfig");
const { sendEmail } = require("../utils/emailer");
const { Op } = require("sequelize");


const attributes = ["status", "updatedAt"];
const includeUser = {
  model: User,
  as: "User",
  attributes: ["id","name","email"],
  // attributes: userController.attributes,
};
const includeJob = {
  model: Job,
  as: "Job",
  attributes: ["title"],
  // include:jobController.include
  include: [
    {
      model: Position,
      as: "jobPosition",
      attributes: ["position_name"],
    },
    {
      model: Experience,
      as: "jobExperience",
      attributes: ["exp_desc"],
    },
    {
      model: Type,
      as: "jobType",
      attributes: ["job_type"],
    }
  ],
};
const include = [includeUser, includeJob];

const applicationEmailTemplate = fs.readFileSync("./src/emails/email.ejs", {
  encoding: "utf-8",
});
// Render the email

module.exports = {
  includeUser,
  includeJob,
  attributes,
  getAll: async (req, res) => {
    return await crudController.getAll(Application, {
      where: {},
      include,
      paginated: true,
    })(req, res);
  },

  getById: crudController.getById(Application, { include }),

  getByUserId: async (req, res) => {
    const { id } = req.params;
    return await crudController.getAll(Application, {
      where: { userId: id },
      include: includeJob,
      attributes,
    })(req, res);
  },

  getByJobId: async (req, res) => {
    const { id } = req.params;
    return await crudController.getAll(Application, {
      where: { jobId: id },
      include: includeUser,
      attributes,
    })(req, res);
  },

  getApplicationsByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Validate startDate and endDate
      if (!startDate || !endDate) {
        return res.status(400).json({
          code: 400,
          status: "Bad Request",
          message: "Please provide valid startDate and endDate parameters.",
        });
      }
  
      // Parse the start and end dates as Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
  
      // Check if startDate is after endDate or the same day
      if (startDateObj > endDateObj) {
        return res.status(400).json({
          code: 400,
          status: "Bad Request",
          message: "Start date cannot be chronologically after or the same as the end date.",
        });
      }
  
      // Fetch applications based on the date range
      const applications = await Application.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: include, // Include User and Job models as needed
      });
  
      if (applications.length === 0) {
        return res.status(200).json({
          code: 200,
          status: "OK",
          message: "No applications found within the specified date range.",
          data: {
            applications: [], // Return an empty array to indicate no matching applications
          },
        });
      }
  
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success getting applications within the date range",
        data: {
          applications,
        },
      });
    } catch (err) {
      return handleError(res, err);
    }
  },  

  create: async (req, res) => {
    const data = req.body;
    // TODO : validation
    // verify if not admin
    const { closedAt, quota, applicant } = await Job.findOne({
      where: { id: data.jobId },
    });
    if (req.user.role !== "Admin") {
      // verify if job closed
      const close = new Date(closedAt).getTime();
      const now = new Date().getTime();
      // console.log(`closed ${close}, now ${now}`);
      // if closed
      if (now >= close) {
        return res.status(400).json({
          message: `Job is closed`,
        });
      }
      // verify if quota availible
      if (applicant >= quota) {
        return res.status(400).json({
          message: `Job is full`,
        });
      }
    }
    const ret = await crudController.create(Application, data)(req, res);
    return ret;
  },

  update: async (req, res) => {
    const ret = await crudController.update(Application, { include , send:false})(req,res) // TODO : validation
    ret["emailStatus"] = 'not sent';
    if (ret.code == 200) {
      const status = ret.data.status; // Application's status
      if (status) {
        try {
          const user = ret.data.User;
          let emailMessage = "";
          if (status === "Rejected") {
            emailMessage = ejs.render(applicationEmailTemplate, {
              name: user.name,
              jobTitle: ret.data.Job.title,
              status: "belum dapat kami terima",
            });
          } else if (status === "Accepted") {
            emailMessage = ejs.render(applicationEmailTemplate, {
              name: user.name,
              jobTitle: ret.data.Job.title,
              status: "lolos tahap selanjutnya",
            });
          }
          const emailerResult = await sendEmail({
            ...mailOptions,
            subject: mailOptions.subjectPrefix + "- application",
            to: user.email,
            html: emailMessage,
          })
            .then(() => {
              ret["emailStatus"] = "sent";
            })
            .catch((e) => {
              throw e;
            })
        } catch (e) {
          ret["emailError"] = e.message;
        }
      }
    }
    return res.status(ret.code).json(ret);
  },
  
  delete: crudController.delete(Application),
};