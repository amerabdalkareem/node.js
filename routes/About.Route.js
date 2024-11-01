const express = require("express");
const router = express.Router();
const AboutController = require("../Controller/About.Controller");
const { validationSchma } = require("../Middleware/validationSchma");
const verfitToken = require("../Middleware/verfitToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../Middleware/allowedTo");

router
  .route("/")
  .get(AboutController.GetAllAbout)
  .post(
    validationSchma(),
    allowedTo(userRoles.MANGER),
    AboutController.PostAbout
  );

router
  .route("/:aboutID")
  .get(AboutController.GetAbout)
  .patch(AboutController.PatchAbout)
  .delete(
    verfitToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    AboutController.DeleteAbout
  );

module.exports = router;
