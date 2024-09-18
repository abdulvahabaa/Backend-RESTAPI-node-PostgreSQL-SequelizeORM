const user = require("../db/models/user");

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
  });

  if (!newUser) {
    return res.status(400).json({
      status: "fail",
      message: "Faild to create user",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "User created successfully",
    data: {
      newUser,
    },
  });
};

module.exports = {
  signup,
};
