const mongoose = require("mongoose");

const connect = async () => {
  return await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("db connect");
    })
    .catch((err) => console.log(err));
};

module.exports = connect;
