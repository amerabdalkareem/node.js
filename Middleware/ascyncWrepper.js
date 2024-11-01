module.exports = (ascyncFn) => {
  return (request, response, next) => {
    ascyncFn(request, response, next).catch((error) => next(error));
  };
};
