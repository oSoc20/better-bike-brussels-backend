const jsonQuery = require('json-query')
const Distance = require('geo-distance');

module.exports = class GeoFilter {

    constructor(geoJsonObject) {
        this.geoJson = geoJsonObject
    }

    /**
     * Filters the answers ordered by the closest according to:
     * @param center_latitude
     * @param center_longitude
     * @param radius maximum radius of answers from the center (in metres)
     * @param max_answers
     * @returns {Promise<void>}
     */
    filter(center_latitude, center_longitude, radius, max_answers) {

        //console.log("Filtering...");
        let new_geojson;
        switch (this.geoJson.type) {
            case "FeatureCollection":

                let list = this.geoJson.features.map((item) => {
                    let sub_filter = new GeoFilter(item);
                    return sub_filter.filter(center_latitude, center_longitude, radius, max_answers);
                }).filter((item) => {
                    return item !== null
                });

                new_geojson = {
                    type: 'FeatureCollection',
                    features: list
                };
                break;
            case "Feature":
                let client_center = {
                    lat: center_latitude,
                    lon: center_longitude
                }
                let feature_pos = {
                    lat: this.geoJson.geometry.coordinates[1],
                    lon: this.geoJson.geometry.coordinates[0]
                }

                if (Distance.between(client_center, feature_pos) < Distance(radius + "m")) {
                    
                    this.geoJson.properties.dist = Distance.between(client_center, feature_pos).human_readable();
                    this.geoJson.radians = Distance.between(client_center, feature_pos).radians;
                    
                    new_geojson = this.geoJson
                } else {
                    new_geojson = null;
                }


                break;
            default:
                break;
        }

        return new_geojson;
    }

}