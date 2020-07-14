const express = require("express");
const router = express.Router();
const axios = require("axios");
const cache = require("../scripts/cache");
const Converter = require("../scripts/converter");
const GeoFilter = require("../scripts/filtering");
var sortJsonArray = require("sort-json-array");

router.get("/bicycle-parking", (req, res) => bicycleParking(req, res));
router.get("/villo-stations", (req, res) => villoStation(req, res));
router.get("/air-pump", (req, res) => airPump(req, res));
router.get("/bicycle-repair-station", (req, res) =>
  bicycleRepairStation(req, res)
);
router.get("/bicycle-shop", (req, res) => bicycleShop(req, res));
router.get("/drinking-water", (req, res) => drinkingWater(req, res));

router.get("/endpoints", (req, res) => getMapEndpoints(req, res));

async function bicycleParking(req, res) {
  let key = "bicycle_parking";
  let osmfilter = "node[amenity=bicycle_parking]";

  let icon = {
    iconUrl: "/bicycle_parking.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

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

  data.icon = icon;

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function villoStation(req, res) {
  let key = "villo_station";

  console.log(
    req.query.lat +
      " " +
      req.query.lng +
      " " +
      req.query.radius +
      " " +
      req.query.max_answers
  );

  let icon = {
    iconUrl: "/villo_station.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

  if (cache.get(key)) {
    let data = cache.get(key);

    let filter = new GeoFilter(data);

    let filtered_data = filter.filter(
      req.query.lat,
      req.query.lng,
      req.query.radius, //radius
      req.query.max_answers
    );

    filtered_data.features = sortJsonArray(
      filtered_data.features,
      "radians",
      "asc"
    );

    if(filtered_data.features.length > req.query.max_answers){
      filtered_data.features.length = req.query.max_answers;
    }

    return res.status(200).json(filtered_data);
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

  //cache.add(key, data); //TODO add timeout?

  // Filter relevant data
  data.icon = icon;

  cache.add(key, data); //TODO add timeout?

  let filter = new GeoFilter(data);

  let filtered_data = filter.filter(
    req.query.lat,
    req.query.lng,
    req.query.radius, //radius
    req.query.max_answers
  );

  filtered_data.features = sortJsonArray(
    filtered_data.features,
    "radians",
    "asc"
  );
    if(filtered_data.features.length > req.query.max_answers){
      filtered_data.features.length = req.query.max_answers;
    }


  return res.status(200).json(filtered_data);
}

async function airPump(req, res) {
  let key = "compressed_air";
  let osmfilter = "node[amenity=compressed_air]";

  let icon = {
    iconUrl: "/compressed_air.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

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

  data.icon = icon;

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function bicycleRepairStation(req, res) {
  let key = "bicycle_repair_station";
  let osmfilter = "node[amenity=bicycle_repair_station]";

  let icon = {
    iconUrl: "/bicycle_repair_station.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

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

  data.icon = icon;

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function bicycleShop(req, res) {
  let key = "bicycle_shop";
  let osmfilter = "node[shop=bicycle]";

  let icon = {
    iconUrl: "/bicycle_shop.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

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

  data.icon = icon;

  cache.add(key, data); //TODO add timeout?

  return res.status(200).json(data);
}

async function drinkingWater(req, res) {
  let key = "drinking_water";
  let osmfilter = "node[amenity=drinking_water]";

  let icon = {
    iconUrl: "/drinking_water.png",
    iconSize: [25,25],
    iconAnchor: [12.5,12.5],
  }

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

  data.icon = icon;

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
