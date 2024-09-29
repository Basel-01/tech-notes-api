require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const router = require("./routes");
const { corsOptions, connectToDatabase } = require("./config");
const { clientError, serverError } = require("./controllers/error");

const app = express();

app.use(cors(corsOptions));

connectToDatabase();

app.disable("x-powered-by");

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.use(clientError);
app.use(serverError);

module.exports = app;
