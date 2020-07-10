const express = require("express");
const router = express.Router();
const axios = require("axios");
const geojson = require('geojson');

router.get("/bicycle-parking", (req, res) => bicycleParking(req, res));
router.get("/villo-stations", (req, res) => villo(req, res));

async function bicycleParking(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function villo(req, res) {
  let url =
    "https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale";
  let json = await fetch(url);

  var villo_stations = [];

  for (var i=0; i<json.data.length; i++) {
      villo_stations[villo_stations.length] = {
          name: json.data[i].name,
          bike_stands: json.data[i].bike_stands,
          lat: json.data[i].position.lat,
          lng: json.data[i].position.lng,
      };
  }

  let data = await geojson.parse(villo_stations, {Point: ['lat', 'lng'], include: ['name', 'bike_stands']});

  return res.status(200).json(data);
}

function fetch(url) {
  return axios.get(url);
}

module.exports = router;
