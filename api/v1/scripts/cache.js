const cache = require("memory-cache");

const dataFetcher = require("../scripts/datafetcher");

const OPENSTREETMAP_REFRESH = 86400000;     // one day
const VILLO_STATION_REFRESH = 3600000;      // one hour
const OFFICIAL_EVENTS_REFRESH = 3600000     // one hour

module.exports = {

    init: async function() {



        // Events
        try{refreshOfficialEvents()}catch(err){console.log(err)}

        // Points of interests
        try{refreshVilloStation()}catch(err){console.log(err)}
        try{await refreshBicycleParking()}catch(err){console.log(err)}
        try{await refreshCompressedAir()}catch(err){console.log(err)}
        try{await refreshBicycleRepairStations()}catch(err){console.log(err)}
        try{await refreshBicycleShop()}catch(err){console.log(err)}
        try{await refreshDrinkingWater()}catch(err){console.log(err)}

    },
    add: function (key, data) {
        cache.put(key, data);

    },
    get: function (key){
        return cache.get(key);
    }
}

async function refreshBicycleParking() {
    await cache.put("bicycle_parking", await dataFetcher.fetchBicycleParking(), OPENSTREETMAP_REFRESH, refreshBicycleParking);
    console.log("done bicycle_parking");
}

async function refreshVilloStation() {
    await cache.put("villo_station", await dataFetcher.fetchVilloStations(), VILLO_STATION_REFRESH, refreshVilloStation);
    console.log("done villo_station");
}

async function refreshCompressedAir() {
    await cache.put("compressed_air", await dataFetcher.fetchAirPumps(), OPENSTREETMAP_REFRESH, refreshCompressedAir);
    console.log("done compressed_air");
}

async function refreshBicycleRepairStations() {
    await cache.put("bicycle_repair_station", await dataFetcher.fetchBicycleRepairStation(), OPENSTREETMAP_REFRESH, refreshBicycleRepairStations);
    console.log("done bicycle_repair_station");
}

async function refreshBicycleShop() {
    await cache.put("bicycle_shop", await dataFetcher.fetchBicycleShop(), OPENSTREETMAP_REFRESH, refreshBicycleShop);
    console.log("done bicycle_shop");
}

async function refreshDrinkingWater() {
    await cache.put("drinking_water", await dataFetcher.fetchDrinkingWater(), OPENSTREETMAP_REFRESH, refreshDrinkingWater);
    console.log("done drinking_water");
}

async function refreshOfficialEvents() {
    cache.put("official_events", await dataFetcher.fetchOfficialEvents(), OFFICIAL_EVENTS_REFRESH, refreshOfficialEvents);
    console.log("done official_events");
}