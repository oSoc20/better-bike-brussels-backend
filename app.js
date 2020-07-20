const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cache = require("./api/v1/scripts/cache")

const apiRoutes = require("./routes/api");
const dataFetcher = require("./api/v1/scripts/datafetcher");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Allow-Control-Alow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
});

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("app listening on port " + port);
});


Promise.resolve(cache.init()).then(r =>
    console.log("Cache init done")
);

