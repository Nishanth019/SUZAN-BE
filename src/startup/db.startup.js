const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
module.exports = () => {
  return mongoose
    .connect(MONGO_URI)
    .then((res) => console.log("💽 Database is Connected Successfully"))
    .catch((err) => console.log("Please Restart Server", err));
};
