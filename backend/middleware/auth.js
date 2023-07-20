const jwt = require("jsonwebtoken");
require("dotenv").config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).send({ message: `Authorization Required` });
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(
            token,
            NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret", {
                expiresIn: "7d",
            }
        );
    } catch (err) {
        return res.status(401).send({ message: "Authorization is Required" });
    }
    console.log(`authorization is success, user id: ${payload._id}`);
    req.user = payload;

    next();
};