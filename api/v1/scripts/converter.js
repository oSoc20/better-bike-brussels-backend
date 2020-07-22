const GeoJSON = require('geojson');
const osmToGeoJson = require('osmtogeojson');

module.exports = class converter {
	constructor(data) {
		this.data = data;
	}

	villoToGeoJson() {
		let villo_stations = this.data.map((x) => {
			return {
				name: x.name,
				bike_stands: x.bike_stands,
				lat: x.position.lat,
				lng: x.position.lng,
			};
		});

		return GeoJSON.parse(villo_stations, {
			Point: ['lat', 'lng'],
			include: ['name', 'bike_stands'],
		});
	}

	osmToGeoJson() {
		return osmToGeoJson(this.data);
	}
};
