const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const verfitToken = (request, response, next) => {
  const authHeader =
    request.headers["Authrization"] || request.headers["authrization"];
  if (!authHeader) {
    const error = appError.create(
      "token is required",
      401,
      httpStatusText.ERROR
    );
    next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    request.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("invild token", 401, httpStatusText.ERROR);
    next(error);
  }
  next();
};

module.exports = verfitToken;
