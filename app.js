const express = require("express");
const app = express();

const apiRoutes = require("./routes/api")

app.use("/api", apiRoutes);

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("app listening on port " + port);
});
