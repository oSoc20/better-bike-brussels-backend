const express = require("express");
const router = express.Router();
const cache = require("../scripts/cache");
const Converter = require("../scripts/converter");
const GeoFilter = require("../scripts/filtering");
const sortJsonArray = require("sort-json-array");
const validator = require("validator");

router.get("/bicycle-parking", (req, res) => bicycleParking(req, res));
router.get("/villo-stations", (req, res) => villoStation(req, res));
router.get("/air-pump", (req, res) => airPump(req, res));
router.get("/bicycle-repair-station", (req, res) =>
  bicycleRepairStation(req, res)
);
router.get("/bicycle-shop", (req, res) => bicycleShop(req, res));
router.get("/drinking-water", (req, res) => drinkingWater(req, res));

router.get("/endpoints", (req, res) => getMapEndpoints(req, res));
router.get("/current-street", (req, res) => reverseGeocode(req, res));



async function bicycleParking(req, res) {
  let key = "bicycle_parking";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
    try {
      var json = await fetch_url(osmUrl(osmfilter));
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "internal server error" });
    }

    var data = new Converter(json.data).osmToGeoJson();


    cache.add(key, data); //TODO add timeout?
  }

  let filtered_data = mapfilter(
      data,
      req.query.lat,
      req.query.lng,
      req.query.radius,
      req.query.max_answers
  );

  filtered_data.icon = "bicycle_parking.svg";
  filtered_data.title = "Bicycle parking";

  return res.status(200).json(filtered_data);
}


async function villoStation(req, res) {
  let key = "villo_station";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
    return res.status(500).json({ error: "internal server error" });
  }

  // Filter relevant data
  let filtered_data = mapfilter(
    data,
    req.query.lat,
    req.query.lng,
    req.query.radius,
    req.query.max_answers
  );

  filtered_data.icon = "villo_station.svg";
  filtered_data.title = "Villo station";

  return res.status(200).json(filtered_data);
}

async function airPump(req, res) {
  let key = "compressed_air";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
    return res.status(500).json({ error: "internal server error" });
  }
  let filtered_data = mapfilter(
    data,
    req.query.lat,
    req.query.lng,
    req.query.radius,
    req.query.max_answers
  );

  filtered_data.icon = "compressed_air.svg";
  filtered_data.title = "Air pump";

  return res.status(200).json(filtered_data);
}

async function bicycleRepairStation(req, res) {
  let key = "bicycle_repair_station";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
      return res.status(500).json({ error: "internal server error" });
  }

  let filtered_data = mapfilter(
    data,
    req.query.lat,
    req.query.lng,
    req.query.radius,
    req.query.max_answers
  );

  filtered_data.icon = "bicycle_repair_station.svg";
  filtered_data.title = "Repair station";

  return res.status(200).json(filtered_data);
}

async function bicycleShop(req, res) {
  let key = "bicycle_shop";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
    return res.status(500).json({ error: "internal server error" });
  }

  let filtered_data = mapfilter(
    data,
    req.query.lat,
    req.query.lng,
    req.query.radius,
    req.query.max_answers
  );

  filtered_data.icon = "bicycle_shop.svg";
  filtered_data.title = "Bicycle shop";

  return res.status(200).json(filtered_data);
}

async function drinkingWater(req, res) {
  let key = "drinking_water";

  if (!validate(req)) {
    return res.status(400).json({ error: "query not valid" });
  }

  if (cache.get(key)) {
    var data = cache.get(key);
  } else {
    return res.status(500).json({ error: "internal server error" });
  }

  let filtered_data = mapfilter(
    data,
    req.query.lat,
    req.query.lng,
    req.query.radius,
    req.query.max_answers
  );

  filtered_data.icon = "drinking_water.svg";
  filtered_data.title = "Water tap";

  return res.status(200).json(filtered_data);
}

async function getMapEndpoints(req, res) {
  let endpoints = router.stack.map((x) => "/api/v1/map" + x.route.path);
  res
    .status(200)
    .json({ success: endpoints.filter((e) => e !== "/api/v1/map/endpoints" && e !== "/api/v1/map/current-street") });
}

async function reverseGeocode(req, res) {
  if (
    req.query.lat &&
    req.query.lng &&
    !validator.isEmpty(req.query.lat) &&
    validator.isDecimal(req.query.lat) &&
    !validator.isEmpty(req.query.lng) &&
    validator.isDecimal(req.query.lng)
  ) {
    try {
      var data = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${req.query.lat}&lon=${req.query.lng}&format=json`);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "internal server error" });
    }
    console.log(data.data.address);
    let street = data.data.address.road;
    let n = street.search(" - ");
    
    if(n == -1){
      return res.status(200).json({streetname_fr: street,streetname_nl: street});
    }

    return res.status(200).json({streetname_fr: street.substr(0,n),streetname_nl: street.substr(n+3)});
  }
  return res.status(400).json({ error: "query not valid" });
}

function mapfilter(data, lat, lng, radius, max_answers) {
  let filter = new GeoFilter(data);

  let filtered_data = filter.filter(lat, lng, radius, max_answers);

  filtered_data.features = sortJsonArray(
    filtered_data.features,
    "radians",
    "asc"
  );
  if (filtered_data.features.length > max_answers) {
    filtered_data.features.length = max_answers;
  }

  return filtered_data;
}


function validate(req) {
  if (
    req.query.lat &&
    req.query.lng &&
    req.query.radius &&
    req.query.max_answers &&
    !validator.isEmpty(req.query.lat) &&
    validator.isDecimal(req.query.lat) &&
    !validator.isEmpty(req.query.lng) &&
    validator.isDecimal(req.query.lng) &&
    !validator.isEmpty(req.query.radius) &&
    !validator.isEmpty(req.query.max_answers)
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
