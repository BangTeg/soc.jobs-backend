const { Experience } = require("../db/models");
const { crudController } = require("../utils/crud");


module.exports = {
  getAll: async (req, res) => {
    return await crudController.getAll(Experience, {
      where: {},
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })(req, res);
  },
  getById: crudController.getById(Experience),
  // create: crudController.create(Experience),
  // update: crudController.update(Experience),
  // delete: crudController.delete(Experience),
};