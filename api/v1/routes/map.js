const express = require("express");
const router = express.Router();
const axios = require("axios");
const geojson = require("geojson");
const cache = require("../scripts/cache");

router.get("/bicycle-parking", (req, res) => bicycleParking(req, res));
router.get("/villo-stations", (req, res) => villoStation(req, res));
router.get("/air-pump", (req, res) => airPump(req, res));
router.get("/bicycle-repair-station", (req, res) => bicycleRepairStation(req, res));
router.get("/bicycle-shop", (req, res) => bicycleShop(req, res));
router.get("/bicycle-rental", (req, res) => bicycleRental(req, res));

router.get("/endpoints", (req, res) => getMapEndpoints(req, res));

async function bicycleParking(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function villoStation(req, res) {
  if(cache.get("villo")){
    return res.status(200).json(cache.get("villo"));
  }

  let url = "https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale";
  let json = await fetch(url);

  var villo_stations = [];

  for (var i = 0; i < json.data.length; i++) {
    villo_stations[villo_stations.length] = {
      name: json.data[i].name,
      bike_stands: json.data[i].bike_stands,
      lat: json.data[i].position.lat,
      lng: json.data[i].position.lng,
    };
  }

  let data = await geojson.parse(villo_stations, {
    Point: ["lat", "lng"],
    include: ["name", "bike_stands"],
  });

  cache.add("villo", data); //TODO add timeout?

  return res.status(200).json(data);
} //TODO switch conversion to convert.js

async function airPump(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function bicycleRepairStation(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function bicycleShop(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function bicycleRental(req, res) {
  res.status(501).json({ error: "not implemented" });
}

async function getMapEndpoints(req, res) {
  let endpoints = router.stack.map((x) => "/api/v1/map" + x.route.path);
  res
    .status(200)
    .json({ success: endpoints.filter((e) => e !== "/api/v1/map/endpoints") });
}

function fetch(url) {return axios.get(url)}

module.exports = router;
