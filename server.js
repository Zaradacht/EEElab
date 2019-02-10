const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// requiring routes
const indexRoutes = require("./routes/index");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting db
const db = require("./config/keys").mongoURI;
// connecting to db
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected Successfuly!"))
  .catch(err => console.log(err));

// using routes
app.use("/", indexRoutes);

// setting PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
