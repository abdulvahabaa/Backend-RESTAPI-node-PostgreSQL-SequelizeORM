const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const signup = async (req, res, next) => {
  console.log("req.body", req.body);
  const body = req.body;
  if (!["1", "2", "3"].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid user type",
    });
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
    return res.status(400).json({
      status: "fail",
      message: "Faild to create user",
    });
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  return res.status(200).json({
    status: "success",
    message: "User created successfully",
    data: {
      result,
    },
  });
};

const login = async (req, res, next1) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password are required",
    });
  }
  const result = await user.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return res.status(400).json({
      status: "fail",
      message: "Icorrect email or password",
    });
  }

  const token = generateToken({ id: result.id });
  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      token,
    },
  });
};

module.exports = {
  signup,
  login,
};
