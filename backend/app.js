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
const { createUser, login } = require("./controllers/users");
const { celebrate, Joi, errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
var cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/aroundb");

app.use(requestLogger);

app.use(cors());
app.options("*", cors()); //enable requests for all routes

app.get("/crash-test", () => {
    setTimeout(() => {
        throw new Error("Server will crash now");
    }, 0);
});

app.post(
    "/signin",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    login
);

app.post(
    "/signup",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    createUser
);

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
    else if (err.statusCode == NOT_AUTHORIZED)
        res.status(NOT_AUTHORIZED).send({ message: err.message });
    else res.status(DEFAULT).send({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});