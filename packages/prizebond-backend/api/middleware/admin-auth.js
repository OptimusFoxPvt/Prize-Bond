const jwt = require("jsonwebtoken");
const { ReE } = require("../../helpers/utils");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization")?.split("Bearer ")[1];

  // Check if not token
  if (!token) {
    return ReE(res, "No token, authorization denied", 401);
  }

  // Verify token
  try {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, decoded) => {
      if (error) {
        return ReE(
          res,
          "Your Session has been Expired.Please login again.",
          403,
        );
      } else {
        if (decoded.type == "admin") {
          req.userId = decoded._id;
          return next();
        }
        return ReE(res, "You are not authorized.", 403);
      }
    });
  } catch (err) {
    return ReE(res, err.message, 500);
  }
};
