require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { limiter } = require("./utils/rateLimiter");

const { PORT = 3001, DATABASE_URL } = process.env;
const app = express();
mongoose.connect(DATABASE_URL, (r) => {
  console.log("connected to DB", r);
});

const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
