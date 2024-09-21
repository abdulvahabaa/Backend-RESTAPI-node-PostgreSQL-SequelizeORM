const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const signup = catchAsync(async (req, res, next) => {
  console.log("req.body", req.body);
  const body = req.body;
  if (!["1", "2", "3"].includes(body.userType)) {
    throw new AppError("Invalid user type", 400);
  }

  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Faild to create user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  return res.status(200).json({
    status: "success",
    message: "User created successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }
  const result = await user.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect email or password", 400));
  }

  const token = generateToken({ id: result.id });
  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }

  const decoded = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return next(new AppError("Unauthorized", 401));
  }

  const freshUser = await user.findByPk(decoded.id);
  if (!freshUser) {
    return next(new AppError("User no longer exists", 401));
  }

  req.user = freshUser;

  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };

  return checkPermission;
};

module.exports = {
  signup,
  login,
  authentication,
  restrictTo,
};
