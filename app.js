require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./routes/authRoute");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello World, REST API is working fine",
  });
});

// all routes will be here
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "RouteNot Found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "fail",
    message: err.message,
  });
});

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server UP and listening at http://localhost:${PORT}`);
});
