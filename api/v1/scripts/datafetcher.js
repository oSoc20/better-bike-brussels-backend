const Converter = require('./converter');
const axios = require('axios');
const config = require('../../../config');

module.exports = {
	fetchBicycleParking: async function () {
		const osmfilter = 'node[amenity=bicycle_parking]';

		let json = await this.fetch_url(this.osmUrl(osmfilter));
		return new Converter(json.data).osmToGeoJson();
	},

	fetchVilloStations: async function () {
		const url =
      'https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale';

		let json = await this.fetch_url(url);
		return new Converter(json.data).villoToGeoJson();
	},

	fetchAirPumps: async function () {
		const osmfilter = 'node[amenity=compressed_air]';

		let json = await this.fetch_url(this.osmUrl(osmfilter));
		return new Converter(json.data).osmToGeoJson();
	},

	fetchBicycleRepairStation: async function () {
		const osmfilter = 'node[amenity=bicycle_repair_station]';

		let json = await this.fetch_url(this.osmUrl(osmfilter));
		return new Converter(json.data).osmToGeoJson();
	},

	fetchBicycleShop: async function () {
		const osmfilter = 'node[shop=bicycle]';

		let json = await this.fetch_url(this.osmUrl(osmfilter));
		return new Converter(json.data).osmToGeoJson();
	},

	fetchDrinkingWater: async function () {
		const osmfilter = 'node[amenity=drinking_water]';

		let json = await this.fetch_url(this.osmUrl(osmfilter));
		return new Converter(json.data).osmToGeoJson();
	},

	fetchOfficialEvents: async function () {
		const urls = [
			'https://api.brussels:443/api/agenda/0.0.1/events/search?name=fiets',
			'https://api.brussels:443/api/agenda/0.0.1/events/search?name=v%C3%A9lo',
			'https://api.brussels:443/api/agenda/0.0.1/events/search?name=cycli',
		];

		let jsons = urls.map(async function (item) {
			try {
				let json = await fetch_events(item);
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

		return all_events;
	},

	fetch_url: async function (url) {
		let data = await axios.get(url);
		return data;
	},

	osmUrl(filter) {
		let bbox = '[bbox:50.7599,4.2617,50.9238,4.4986]';
		let url = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25]${bbox};(${filter};);out body;>;out skel qt;`;
		return url;
	},
};

async function fetch_events(url) {
	const options = {
		headers: {
			Authorization: getAPIKey(),
			Accept: 'application/json',
		},
	};
	let data = await axios.get(url, options);
	return data;
}

function getAPIKey() {
	return config.env.APIBRUSSELS_API_KEY;
}
