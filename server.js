const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

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
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB Connected Successfuly!"))
  .catch(err => console.log(err));

// mounting routes
app.use("/", indexRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// setting PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
