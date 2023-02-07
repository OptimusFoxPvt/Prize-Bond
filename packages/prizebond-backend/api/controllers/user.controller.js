const { validationResult } = require("express-validator");
const { ReE, ReS } = require("../../helpers/utils");
const User = require("../../models/user.model");
const pagination = require("../../helpers/pagination");
const { ProfileStatus } = require("../../helpers/enums");

exports.getProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ReE(res, errors.errors[0].msg, 400);
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return ReE(res, "User not exist", 404);
    }

    user.password = "";

    return ReS(res, { user, message: "User Profile!" }, 200);
  } catch (e) {
    return ReE(res, e.message, 400);
  }
};
