const cache = require("memory-cache");

const dataFetcher = require("../scripts/datafetcher")

module.exports = {

    init: async function() {
        await cache.put("bicycle_parking", await dataFetcher.fetchBicycleParking(), 10, () => {
        });
        await cache.put("villo_station", await dataFetcher.fetchVilloStations(), 10, () => {
        });
        await cache.put("compressed_air", await dataFetcher.fetchAirPumps(), 100, () => {
            console.log()
        });
        await cache.put("bicycle_repair_station", await dataFetcher.fetchBicycleRepairStation(), 1000, () => {
        });
        await cache.put("bicycle_shop", await dataFetcher.fetchBicycleShop(), 1000, () => {
        });
        await cache.put("drinking_water", await dataFetcher.fetchDrinkingWater(), 1000, () => {
        });

    },
    add: function (key, data) {
        cache.put(key, data);

    },
    get: function (key){
        return cache.get(key);
    }
}