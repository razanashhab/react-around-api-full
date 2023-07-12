const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {
  NOT_FOUND,
  BAD_REQUEST,
  NOT_AUTHORIZED,
  DEFAULT,
} = require("./utils/utils");

const { PORT = 3000 } = process.env;
const app = express();
const auth = require("./middleware/auth");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/aroundb");

app.use(requestLogger);

// authorization
app.use(auth);
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode === NOT_FOUND)
    res.status(NOT_FOUND).send({ message: err.message });
  else if (err.name === "ValidationError")
    res.status(BAD_REQUEST).send({ message: err.message });
  else if (err.name === "CastError")
    res.status(BAD_REQUEST).send({ message: err.message });
  else
    res
      .status(DEFAULT)
      .send({ message: "An error has occurred on the server" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
