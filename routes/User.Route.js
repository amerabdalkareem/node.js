const express = require("express");
const router = express.Router();
const multer = require("multer");
const dickStorage = multer.diskStorage({
  destination: function (request, filed, cb) {
    console.log("FILE", filed);
    cb(null, "uploads");
  },
  filename: function (request, filed, cb) {
    const ext = filed.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const fileFilter = function (request, filed, cb) {
  const imgType = filed.mimetype.split("/")[0];

  if (imgType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file most be at img", 400), false);
  }
};
const upload = multer({ storage: dickStorage, fileFilter });
const UserController = require("../Controller/User.Controller");
const verfitToken = require("../Middleware/verfitToken");
const appError = require("../utils/appError");

// get all user
// register
// login

router.route("/").get(verfitToken, UserController.getAllUsers);
router
  .route("/register")
  .post(upload.single("avater"), UserController.register);
router.route("/login").post(UserController.login);

module.exports = router;
