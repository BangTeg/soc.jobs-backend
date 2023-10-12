const { Position } = require('../db/models');
const { crudController } = require("../utils/crud");


module.exports = {
  getAll: async (req, res) => {
    return await crudController.getAll(Position, {
      where: {},
      attributes: {exclude:['createdAt','updatedAt']}
    })(req, res);
  },
  // getById: crudController.getById(Position),
  // create: crudController.create(Position),
  // update: crudController.update(Position),
  // delete: crudController.delete(Position),
};