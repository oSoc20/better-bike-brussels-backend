const express = require("express");
const router = express.Router();
const axios = require("axios");
const cache = require("../scripts/cache");
const Converter = require("../scripts/converter");

router.get("/bicycle-parking", (req, res) => bicycleParking(req, res));
router.get("/villo-stations", (req, res) => villoStation(req, res));
router.get("/air-pump", (req, res) => airPump(req, res));
router.get("/bicycle-repair-station", (req, res) =>
  bicycleRepairStation(req, res)
);
router.get("/bicycle-shop", (req, res) => bicycleShop(req, res));
router.get("/bicycle-rental", (req, res) => bicycleRental(req, res));
router.get("/drinking-water", (req, res) => drinkingWater(req, res));

router.get("/endpoints", (req, res) => getMapEndpoints(req, res));

async function bicycleParking(req, res) {
  let key = "bicycle_parking";
  let osmfilter = "node[amenity=bicycle_parking]";

  if (cache.get(key)) {
    return res.status(200).json(cache.get(key));
  }

  try {
    var json = await fetch(osmUrl(osmfilter));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }

  let converter = new Converter(json.data);
  let data = converter.osmToGeoJson();

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function villoStation(req, res) {
  let key = "villo_station";

  if (cache.get(key)) {
    return res.status(200).json(cache.get(key));
  }

  let url =
    "https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale";

  try {
    var json = await fetch(url);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }

  let converter = new Converter(json.data);
  let data = converter.villoToGeoJson();

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

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

async function drinkingWater(req,res){
  let key = "drinking_water";
  let osmfilter = "node[amenity=drinking_water]";

  if (cache.get(key)) {
    return res.status(200).json(cache.get(key));
  }

  try {
    var json = await fetch(osmUrl(osmfilter));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }

  let converter = new Converter(json.data);
  let data = converter.osmToGeoJson();

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function getMapEndpoints(req, res) {
  let endpoints = router.stack.map((x) => "/api/v1/map" + x.route.path);
  res
    .status(200)
    .json({ success: endpoints.filter((e) => e !== "/api/v1/map/endpoints") });
}

function fetch(url) {
  return axios.get(url);
}

function osmUrl(filter) {
  let bbox = "[bbox:50.685,4.234,50.975,4.481]"; //TODO what are we going to do with this???????
  let url = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25]${bbox};(${filter};);out body;>;out skel qt;`;
  return url;
}



module.exports = router;
