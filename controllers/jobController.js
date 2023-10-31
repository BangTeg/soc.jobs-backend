const { Job, Experience, Position, Type } = require("../db/models");
const { crudController } = require("../utils/crud");
const { handleError } = require("../utils/errorHandler");
const { Op } = require("sequelize");

const defaultPageLimit = 10; // Define default page limit

const include = [
  {
    model: Type,
    as: "jobType",
    attributes: ["job_type"],
  },
  {
    model: Experience,
    as: "jobExperience",
    attributes: ["exp_desc"],
  },
  {
    model: Position,
    as: "jobPosition",
    attributes: ["position_name"],
  },
];

module.exports = {
  include,
  getAll: async (req, res) => {
    const filter = {};
    return await crudController.getAll(Job, {
      where: filter,
      include,
      paginated: true,
    })(req, res);
  },

  getAllWithFilters: async (req, res) => {
    const { jobType, position, experience } = req.query;
    const where = {};

    if (jobType) {
      where.typeId = jobType;
    }

    if (position) {
      where.positionId = position;
    }

    if (experience) {
      where.expId = experience;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || defaultPageLimit;
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Job.findAndCountAll({
        where,
        include,
        limit,
        offset,
      });

      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success getting filtered jobs",
        data: {
          jobs: rows,
          totalJobs: count,
        },
      });
    } catch (err) {
      return handleError(res, err);
    }
  },

  getJobsByDateRange: async (req, res) => {
    // console.log("getJobsByDateRange function is called.");
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
  
      // Adjust startDate and endDate to match the database date format
      const formattedStartDate = startDate + ' 00:00:00';
      const formattedEndDate = endDate + ' 23:59:59';
  
      // Fetch jobs based on the date range
      const jobs = await Job.findAll({
        where: {
          createdAt: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        include,
      });
  
      if (jobs.length === 0) {
        return res.status(200).json({
          code: 200,
          status: "OK",
          message: "No jobs found within the specified date range.",
          data: {
            jobs: [], // Return an empty array to indicate no matching jobs
          },
        });
      }
  
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success getting jobs within the date range",
        data: {
          jobs,
        },
      });
    } catch (err) {
      return handleError(res, err);
    }
  },  

  getById: crudController.getById(Job, { include }),
  create: crudController.create(Job),
  update: crudController.update(Job, { include }),
  delete: crudController.delete(Job),
};
