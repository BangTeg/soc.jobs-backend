const { handleError } = require("../utils/errorHandler"); // Import the error handling function

const defaultPageLimit = 10;

const crudController = {
  getAll: (model, options = {}) => {
    const { where = {}, include = [], attributes, paginated = false, raw=false,nest=true } = options;
    return async (req, res) => {
      try {
        let pageOptions = {},
          page,
          limit;
        if (paginated) {
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || defaultPageLimit;
          pageOptions.limit = limit;
          pageOptions.offset = (page - 1) * limit;
        }

        // Use Sequelize's findAndCountAll for pagination
        const { count, rows } = await model.findAndCountAll({
          where,
          include,
          attributes,
          raw,
          nest,
          ...pageOptions,
        });

        const f =
          options.f ??
          ((req, res, rows) => {
            return {
              rows,
              totalRows: count,
            };
          });
        const data = await f(req, res, rows);
        if (!data) {
          return res.status(404).json({
            code: 404,
            status: "Not Found",
            message: `${model.name} not found`,
          });
        }
        console.log('data')
        console.log(data)
        if (paginated) {
          const totalPages = Math.ceil(count / limit);
          data.totalPages = totalPages;
          data.currentPage = page;
        }
        return res.status(200).json({
          code: 200,
          status: "OK",
          message: `Success getting ${paginated ? "paginated " : ""}${
            model.name
          }(s)`,
          data,
        });
      } catch (err) {
        return handleError(res, err);
      }
    };
  },
  getPaginated: (model, options = {}) => {
    return async (req, res) => {
      options["paginated"] = true;
      return await crudController.getAll(model, options)(req, res);
    };
  },

  getById: (model, options = {}, id) => {
    return async (req, res) => {
      id ??= req.params.id;
      options.where = { id };
      options.f ??= (req, res, data) => data;
      const ff = options.f;
      options.f = async (req, res, data) => (await ff(req, res, data))?.[0];
      return await crudController.getAll(model, options)(req, res);
    };
  },

  create: (model, data) => {
    return async (req, res) => {
      data ??= req.body;
      try {
        const row = await model.create(data);
        return res.status(201).json({
          code: 201,
          status: "Created",
          message: `Success creating ${model.name}`,
          data: row, // Return the created row directly
        });
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },

  update: (model, options = {}, id, data) => {
    const { include, attributes, raw=false,nest=true } = options;
    return async (req, res) => {
      id ??= req.params.id;
      data ??= req.body;

      try {
        const [updated] = await model.update(data, {
          where: { id },
        });
        if (!updated) {
          return res.status(404).json({
            code: 404,
            status: "Not Found",
            message: `${model.name} not found, finding ${id}`,
          });
        }
        const row = await model.findByPk(id, {
          include,
          attributes,
        });
        return res.status(200).json({
          code: 200,
          status: "OK",
          message: `Success updating ${model.name}`,
          data: row, // Return the updated row directly
        });
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },

  delete: (model, id) => {
    return async (req, res) => {
      id ??= req.params.id;

      try {
        const deleted = await model.destroy({
          where: { id },
        });
        if (!deleted) {
          return res.status(404).json({
            code: 404,
            status: "Not Found",
            message: `${model.name} not found, finding ${id}`,
          });
        }
        return res.status(200).json({
          code: 200,
          status: "OK",
          message: `Success deleting ${model.name}`,
        });
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },
};

module.exports = { crudController };
