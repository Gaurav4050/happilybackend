const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const Auth = require("../models/auth");

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
      message: "SignIn Require && Error in Requiresignin Middleware",
    });
  }
};

exports.isDean = async (req, res, next) => {
  try {
    const user = await Auth.find({ _id: req.user.userId, userType: "dean" });
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
      message: "Error in isDean middelware ",
    });
  }
};
