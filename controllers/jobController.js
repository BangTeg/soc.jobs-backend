const { Job, Experience, Position, Type } = require("../db/models");
const { crudController } = require("../utils/crud");

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
]

module.exports = {
  include,
  getAll: async (req, res) => {
    // const filter = req.params;
    const filter = {};
    return await crudController.getAll(Job, {
      where: filter,
      include,
      paginated: true,
    })(req, res);
  },
  getById: crudController.getById(Job, { include }),
  create: crudController.create(Job), // TODO : validation
  update: crudController.update(Job, { include }), // TODO : validation
  delete: crudController.delete(Job),
};