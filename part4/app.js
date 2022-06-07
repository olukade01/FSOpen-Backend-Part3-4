const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const userRouter = require("./controllers/users");
const { MONGODB_URI } = require("./utils/config");
const { error, info } = require("./utils/logger");
const {
  unknownEndPoint,
  requestLogger,
  tokenExtractor,
  errorHandler,
} = require("./utils/middleware");

info("connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((err) => {
    error("error connecting to MongoDB:", err.message);
  });

app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use(unknownEndPoint);
app.use(errorHandler);

module.exports = app;
