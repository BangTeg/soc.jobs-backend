const { Type } = require('../db/models');
const { crudController } = require("../utils/crud");


module.exports = {
  getAll: async (req, res) => {
    return await crudController.getAll(Type, {
      where: {},
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })(req, res);
  },
  getById: crudController.getById(Type),
  // create: crudController.create(Type),
  // update: crudController.update(Type),
  // delete: crudController.delete(Type),
};