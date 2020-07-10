const express = require("express");
const app = express();

const mapRoutes = require("./routes/map");

app.use("/map", mapRoutes);

module.exports = app;
