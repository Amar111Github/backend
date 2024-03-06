
const mongoose = require('mongoose')
require("dotenv").config();
let mongoURI = process.env.DATABASEURL;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongoURI)
  .then(() => console.log("db connection successful"))
  .catch(err => console.log(err));

  const connection = mongoose.createConnection(mongoURI);

  module.exports = connection