const cache = require("memory-cache");

const dataFetcher = require("../scripts/datafetcher");

const OPENSTREETMAP_REFRESH = 86400000;     // one day
const VILLO_STATION_REFRESH = 3600000;      // one hour
const OFFICIAL_EVENTS_REFRESH = 3600000     // one hour

module.exports = {

    init: async function() {
        // Points of interests
        /*
        await refreshBicycleParking();

        await refreshVilloStation();
        await refreshCompressedAir();
        await refreshBicycleRepairStations();
        await refreshBicycleShop();

        await refreshDrinkingWater();
        */
        // Events
        await refreshOfficialEvents();
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
}

async function refreshVilloStation() {
    await cache.put("villo_station", await dataFetcher.fetchVilloStations(), VILLO_STATION_REFRESH, refreshVilloStation);
}

async function refreshCompressedAir() {
    await cache.put("compressed_air", await dataFetcher.fetchAirPumps(), OPENSTREETMAP_REFRESH, refreshCompressedAir);
}

async function refreshBicycleRepairStations() {
    await cache.put("bicycle_repair_station", await dataFetcher.fetchBicycleRepairStation(), OPENSTREETMAP_REFRESH, refreshBicycleRepairStations);
}

async function refreshBicycleShop() {
    await cache.put("bicycle_shop", await dataFetcher.fetchBicycleShop(), OPENSTREETMAP_REFRESH, refreshBicycleShop);
}

async function refreshDrinkingWater() {
    await cache.put("drinking_water", await dataFetcher.fetchDrinkingWater(), OPENSTREETMAP_REFRESH, refreshDrinkingWater);
}

async function refreshOfficialEvents() {
    await cache.put("official_events", await dataFetcher.fetchOfficialEvents(), OFFICIAL_EVENTS_REFRESH, refreshOfficialEvents);
}