require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const authRouter = require("./routes/authRoute");
const projectRouter = require("./routes/projectRoute");
const userRouter = require("./routes/userRoute");
const catchAsync = require("./utils/catchAsync");
const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Hello World, REST API is working fine",
//   });
// });

// all routes will be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use('/api/v1/users', userRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server UP and listening at http://localhost:${PORT}`);
});
