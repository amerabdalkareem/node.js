const Data = require("../models/about.model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const ascyncWrepper = require("../Middleware/ascyncWrepper");
const AppError = require("../utils/appError");

const GetAllAbout = ascyncWrepper(async (request, response) => {
  const query = request.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  // get all data from DB useuing about model
  const data = await Data.find({}, { __v: false }).limit(limit).skip(skip);
  response.json({ status: httpStatusText.SUCCESS, information: { data } });
});

const GetAbout = ascyncWrepper(async (request, response, next) => {
  const about = await Data.findById(request.params.aboutID);
  if (!about) {
    const error = AppError.create("Not Found About", 404, httpStatusText.FAIL);
    return next(error);
  }
  return response.json({
    status: httpStatusText.SUCCESS,
    information: { about },
  });
});

const PostAbout = ascyncWrepper(async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const newData = new Data(request.body);
  await newData.save();
  response
    .status(201)
    .json({ status: httpStatusText.SUCCESS, information: { data: newData } });
});

const PatchAbout = ascyncWrepper(async (request, response) => {
  const aboutID = request.params.aboutID;
  const updatedAbout = await Data.updateOne(
    { _id: aboutID },
    { $set: { ...request.body } }
  );
  return response.status(200).json({
    status: httpStatusText.SUCCESS,
    information: { data: updatedAbout },
  });
});

const DeleteAbout = ascyncWrepper(async (request, response) => {
  await Data.deleteOne({ _id: request.params.aboutID });
  response
    .status(200)
    .json({ status: httpStatusText.SUCCESS, information: null });
});

module.exports = {
  GetAllAbout,
  GetAbout,
  PostAbout,
  PatchAbout,
  DeleteAbout,
};
