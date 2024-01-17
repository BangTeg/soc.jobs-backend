const { handleError } = require("../utils/errorHandler"); // Import the error handling function

// PAGINATION OPTIONS
// TODO : move to config
const defaultPageLimit = 10;

// CRUD operations logics
const crudController = {
  // READ operation logics

  // READ multiple rows
  getAll: (model, options = {}) => {
    // get option parameters
    const {
      where = {},
      include = [],
      attributes,
      paginated = false,
      raw = true,
      nest = true,
      send = true,
    } = options;

    return async (req, res) => {
      try {
        // Pagination
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
          order: [["createdAt", "DESC"]], // Order by createdAt in descending order
          ...pageOptions,
        });

        // Allows data modification with the passed function "f"
        const f =
        options.f ??
        ((req, res, rows) => {
          return {
            rows,
            totalRows: count,
          };
        });
        const data = await f(req, res, rows);

        // const data = rows;
        
        // Handle empty db query result
        if (!data) {
          const ret = {
            code: 404,
            status: "Not Found",
            message: `${model.name} not found`,
          };
          if (send) res.status(404).json(ret);
          return ret;
        }
        // console.log('data')
        // console.log(data)

        // Pagination
        if (paginated) {
          const totalPages = Math.ceil(count / limit);
          data.totalPages = totalPages;
          data.currentPage = page;
        }
        const ret = {
          code: 200,
          status: "OK",
          message: `Success getting ${paginated ? "paginated " : ""}${
            model.name
          }(s)`,
          data,
        };
        if (send) res.status(200).json(ret);
        return ret;
      } catch (err) {
        return handleError(res, err);
      }
    };
  },
  // READ (paginated)
  // TODO : Remove
  getPaginated: (model, options = {}) => {
    return async (req, res) => {
      options["paginated"] = true;
      return await crudController.getAll(model, options)(req, res);
    };
  },
  
  getById: (model, options = {}, _id) => {
    return async (req, res) => {
      const id = _id ?? req.params.id;
      try {
        const row = await model.findByPk(id, {
          where: options.where || {},
          include: options.include || [],
          attributes: options.attributes || undefined,
          raw: options.raw || true,
          nest: options.nest || true,
        });
  
        if (!row) {
          const ret = {
            code: 404,
            status: "Not Found",
            message: `${model.name} not found`,
          };
          if (options.send !== false) res.status(404).json(ret);
          return ret;
        }
  
        const ret = {
          code: 200,
          status: "OK",
          message: `Success getting ${model.name}`,
          data: row,
        };
  
        if (options.send !== false) res.status(200).json(ret);
        return ret;
      } catch (err) {
        return handleError(res, err);
      }
    };
  },  

  // CREATE operation logics
  // TODO : pass validation options
  create: (model, data, options = {}) => {
    const { send = true } = options;
    return async (req, res) => {
      data ??= req.body;
      try {
        const row = await model.create(data);
        const ret = {
          code: 201,
          status: "Created",
          message: `Success creating ${model.name}`,
          data: row, // Return the created row directly
        };
        if (send) res.status(201).json(ret);
        return ret;
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },

  // UPDATE operation logics
  // TODO : pass validation options

  // UPDATE one row using primary key
  update: (model, options = {}, _id, _data) => {
    const {
      include,
      attributes,
      raw = true,
      nest = true,
      send = true,
    } = options;
    return async (req, res) => {
      id = _id ?? req.params.id;
      data = _data ?? req.body;

      try {
        const [updated] = await model.update(data, {
          where: { id },
        });
        if (!updated) {
          const ret = {
            code: 404,
            status: "Not Found",
            message: `${model.name} not found, finding ${id}`,
          };
          if (send) res.status(404).json(ret);
          return ret;
        }

        // Get the updated row
        const row = await model.findByPk(id, {
          include,
          attributes,
          raw,
          nest,
        });
        const ret = {
          code: 200,
          status: "OK",
          message: `Success updating ${model.name}`,
          data: row, // Return the updated row directly
        };
        if (send) res.status(200).json(ret);
        return ret;
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },

  // DELETE operation logics

  // DELTE one row using primary key
  delete: (model, options = {}, _id) => {
    const { send = true } = options;
    return async (req, res) => {
      id = _id ?? req.params.id;
      try {
        const deleted = await model.destroy({
          where: { id },
        });
        if (!deleted) {
          const ret = {
            code: 404,
            status: "Not Found",
            message: `${model.name} not found, finding ${id}`,
          };
          if (send) res.status(404).json(ret);
          return ret;
        }
        const ret = {
          code: 200,
          status: "OK",
          message: `Success deleting ${model.name}`,
        };
        if (send) res.status(200).json(ret);
        return ret;
      } catch (err) {
        return handleError(res, err); // Handle errors using the handleError function
      }
    };
  },
};

module.exports = { crudController };