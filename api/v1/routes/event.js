const express = require("express");
const router = express.Router();
const axios = require("axios");
const cache = require("../scripts/cache");
const config = require("../../../config");

router.get("/", (req, res) => {
  res.status(501).json({ error: "not implemented" });
});

router.get("/official", (req, res) => official_events(req, res));
router.get("/official/id/:id", (req, res) => official_event_by_id(req, res));

async function official_events(req, res) {
  let key = "official_events"; // cache key

  let from = parseInt(req.query.from);
  let to = parseInt(req.query.to);

  if (/*cache.get(key)*/ false) {
    var data = cache.get(key);
  } else {
    const urls = [
      "https://api.brussels:443/api/agenda/0.0.1/events/search?name=fiets",
      "https://api.brussels:443/api/agenda/0.0.1/events/search?name=v%C3%A9lo",
      "https://api.brussels:443/api/agenda/0.0.1/events/search?name=cycli",
    ];

    let jsons = urls.map(async function (item) {
      try {
        let json = await fetch(item);
        return json.data;
      } catch (err) {
        console.log(err);
        return null;
      }
    });

    let jsons_nopromise = await Promise.all(jsons);

    let all_events = {
      events: [],
    };

    jsons_nopromise.forEach((item) => {
      if (item.response.resultCount > 0) {
        item.response.results.event.forEach((elem) => {
          all_events.events.push(elem);
        });
      }
    });

    all_events.events = filterByDate(all_events.events, from, to);

    return res.status(200).json(all_events);
  }
}

async function official_event_by_id(req,res){
    try {
        var json = (await fetch(`https://api.brussels:443/api/agenda/0.0.1/events/${req.params.id}`)).data;
      } catch (err) {
          console.log(err);
        return res.status(500).json({ error: "internal server error" });
      }

      return res.status(200).json(json);
}

/**
 * filter events depending on the date
 * @param events an array of events
 * @param from date in Unix Epoch time
 * @param to date in Unix Epoch time
 */
function filterByDate(events, from, to) {
  console.log(from + " " + to);
  let filtered_events = events.filter((item) => {
    // if event.data_next is between from and to, then include it
    if (item.date_next) {
      let next_date = new Date(item.date_next);

      console.log(next_date);
      let next_time = next_date.getTime() / 1000;

      console.log(next_time);
      return from < next_time && next_time < to;
    }
    return false;
  });
  return filtered_events;
}

function fetch(url) {
  const options = {
    headers: {
      Authorization: getAPIKey(),
      Accept: "application/json",
    },
  };
  return axios.get(url, options);
}

function getAPIKey() {
  return config.env.APIBRUSSELS_API_KEY;
}

module.exports = router;
