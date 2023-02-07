const mongoose = require("mongoose");

module.exports = function () {
  const db = process.env.MONGO_DB_CONNECTION;

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log(`Connected to database...`))
    .catch((err) => {
      console.log(`DB Connection Error: ${err.message}`);
    });
};
