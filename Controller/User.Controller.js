const User = require("../models/user.model");
const ascyncWrepper = require("../Middleware/ascyncWrepper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = ascyncWrepper(async (request, response) => {
  const query = request.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  // get all data from DB useuing User model
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  response.json({ status: httpStatusText.SUCCESS, information: { users } });
});

const register = ascyncWrepper(async (request, response, next) => {
  const { firstName, lastName, email, password, role } = request.body;
  const oldusers = await User.findOne({ email: email });
  if (oldusers) {
    const error = appError.create(
      "User alread exists",
      400,
      httpStatusText.FAIL
    );
    next(error);
  }
  // password hashing
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
    role,
    avater: request.filed.fileName,
  });
  // genreate JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  response
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = ascyncWrepper(async (require, response, next) => {
  const { email, password } = require.body;
  if (!email && password) {
    //logged in success
    const error = appError.create(
      "Email and Password is required",
      400,
      httpStatusText.FAIL
    );
    next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 500, httpStatusText.ERROR);
    next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in success
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    response.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create("something wrong", 500, httpStatusText.ERROR);
    next(error);
  }
});

module.exports = { getAllUsers, register, login };
