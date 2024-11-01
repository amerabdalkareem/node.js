const appError = require("../utils/appError");

module.exports = (...roles) => {
  return (request, response, next) => {
    if (roles.includes(request.currentUser.role)) {
      return next(appError.create("this rols is not authorized", 401));
    }
    next();
  };
};
