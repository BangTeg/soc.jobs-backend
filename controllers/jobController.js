const { Job, Experience, Position, Type } = require("../db/models");
const { crudController } = require("../utils/crud");
// const { Op } = require("sequelize");

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

  getById: crudController.getById(Job, { include }),
  create: crudController.create(Job),
  update: crudController.update(Job, { include }),
  delete: crudController.delete(Job),
};
