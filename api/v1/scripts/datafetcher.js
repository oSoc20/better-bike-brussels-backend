
const Converter = require("./converter");
const axios = require("axios");

module.exports = {

    fetchBicycleParking: async function () {
        const osmfilter = "node[amenity=bicycle_parking]";

        let json = await this.fetch_url(this.osmUrl(osmfilter));
        return new Converter(json.data).osmToGeoJson()
    },

    fetchVilloStations: async function () {
        const url = "https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale";

        let json = await this.fetch_url(url);
        return new Converter(json.data).villoToGeoJson();
    },

    fetchAirPumps: async function () {
        const osmfilter = "node[amenity=compressed_air]";

        let json = await this.fetch_url(this.osmUrl(osmfilter));
        return new Converter(json.data).osmToGeoJson()
    },

    fetchBicycleRepairStation: async function () {
        const osmfilter = "node[amenity=bicycle_repair_station]";

        let json = await this.fetch_url(this.osmUrl(osmfilter));
        return new Converter(json.data).osmToGeoJson()
    },

    fetchBicycleShop: async function () {
        const osmfilter = "node[shop=bicycle]";

        let json = await this.fetch_url(this.osmUrl(osmfilter));
        return new Converter(json.data).osmToGeoJson()
    },

    fetchDrinkingWater: async function() {
        const osmfilter = "node[amenity=drinking_water]";

        let json = await this.fetch_url(this.osmUrl(osmfilter));
        return new Converter(json.data).osmToGeoJson()
    },


    async fetch_url(url) {
        let data = await axios.get(url);
        return data
    },

    osmUrl(filter) {
        let bbox = "[bbox:50.7599,4.2617,50.9238,4.4986]"; //TODO what are we going to do with this???????
        let url = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25]${bbox};(${filter};);out body;>;out skel qt;`;
        return url;
    }
}