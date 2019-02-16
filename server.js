const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const keys = require("./config/keys");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");

const app = express();

app.use(logger("dev"));

// require("./config/passport")(passport);
// requiring routes
const indexRoutes = require("./routes/api/index");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting db
const db = require("./config/keys").mongoURI;
// const db = require("./config/keys_dev").mongoDevURI;
//connecting to db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB Connected Successfuly!"))
  .catch(err => console.log(err));

app.use(
  session({
    secret: keys.secretOrKey,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false
  })
);
// passport config
app.use(passport.initialize());
app.use(passport.session());
// mounting routes
app.use("/api/", indexRoutes);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// setting PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
