const express = require("express");
const router = express.Router();

const axios = require("axios");
const cache = require("../scripts/cache");
const config = require("../../../config");

router.get("/", (req, res) => {
  console.log(cache.get("drinking_water"));
});

router.get("/current", ((req, res) => current_weather(req, res)));

async function current_weather(req, res) {
    try{
        var json = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Brussels&appid=${config.env.OPENWEATHERMAP_API_KEY}&lang=${req.query.language}&units=metric`)
        console.log(json.data);
        
    } catch(err){
        console.log(err)
        return res.status(500).json({ error: "internal server error" });
    }
 
    return res.status(200).json({
        temperature: json.data.main.temp,
        description: json.data.weather[0].description,
        icon: json.data.weather[0].icon
    });
}

function fetch(url) {
    console.log(url);
  return axios.get(url);
}

module.exports = router;
