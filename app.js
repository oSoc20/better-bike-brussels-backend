const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const apiRoutes = require("./routes/api");

app.use(bodyParser.urlencoded({extended:true}));
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

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("app listening on port " + port);
});
