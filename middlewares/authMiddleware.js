const jwt = require("jsonwebtoken");
const dean = require("../models/dean");

exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in Requiresignin Middleware",
    });
  }
};

exports.isDean = async (req, res, next) => {
  try {
    const user = await dean.findById(req.user.userId);
    if (user) {
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "Please Login From Dean Account",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
