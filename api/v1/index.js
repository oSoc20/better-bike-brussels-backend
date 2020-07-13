const express = require("express");
const app = express();

const mapRoutes = require("./routes/map");
const eventRoutes = require("./routes/event");

app.use("/map", mapRoutes);
app.use("/event", eventRoutes);

module.exports = app;
