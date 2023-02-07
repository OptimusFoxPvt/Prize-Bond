const pagination = async (req, model, populate, findConditions) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  query = model.find(findConditions);

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.find(findConditions).countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate).lean();
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const pages = Math.ceil(total / limit);

  return {
    results,
    other: {
      total,
      page_count: results.length,
      current_page: page,
      pagination,
      pages,
    },
  };
};

module.exports = pagination;
