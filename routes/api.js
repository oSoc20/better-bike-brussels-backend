const express = require("express")
const app = express();

const v1routes = require("../api/v1/index")

app.use("/v1", v1routes);

module.exports = app;