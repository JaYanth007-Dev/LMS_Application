const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoutes = require("./router/user.routes");
const courseRoutes = require("./router/course.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const morgan = require("morgan");

app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);

app.all("*", (req, res) => {
  res.status(404).send("OOPS! 404 Not Found");
});

app.use(errorMiddleware);
module.exports = app;
