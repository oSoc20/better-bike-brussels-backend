
const http = require('http');
const https = require('https');

const xlsx = require('node-xlsx');
const GeoJSON = require('geojson');

const axios = require('axios');
const fs = require('fs');




class GeoJSONConverter {

    constructor(url) {
        this.source = url;
    }

    download() {
        https.get(url,  (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    // do something with JSON

                    return json;

                } catch (error) {
                    console.error(error.message);
                };
            });
        })

    }

    /**
     * Converts the specific file format to GeoJSON
     */
    convert() {
        let json = this.download()
        return json;
    }

}

class VilloJSONConverter {

    constructor(url) {
        this.url = url;
    }

    /*
    download() {
        https.get(url,  (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    // do something with JSON

                    return json;

                } catch (error) {
                    console.error(error.message);
                };
            });
        }) //.catch(error => {console.error(error.message)})

    } */

    async download() {

        let data = await axios.get(this.url, {
            method: 'get',
            responseType: 'json'
        });

        return data.data;
    }

    /**
     * Converts the specific file format to GeoJSON
     */
    async convert() {
        let json = await this.download();

        var villo_stations = [];

        for (var i=0; i<json.length; i++) {
            villo_stations[villo_stations.length] = {
                name: json[i].name,
                bike_stands: json[i].bike_stands,
                lat: json[i].position.lat,
                lng: json[i].position.lng,
            };
        }

        return GeoJSON.parse(villo_stations, {Point: ['lat', 'lng'], include: ['name', 'bike_stands']});
    }


}

class JSONWriter {

    write(object, path) {
        let as_string = JSON.stringify(object);
        fs.writeFileSync(path, as_string);
    }
}


class BatchConvert {

    work() {

    }
}



let url = "https://data-mobility.brussels/geoserver/bm_bike/wfs?service=wfs&version=1.1.0&request=GetFeature&typeName=bm_bike:tdf_2019&outputFormat=application/json&srsName=epsg:4326";

let villo_url = "https://api.jcdecaux.com/vls/v1/stations?apiKey=6d5071ed0d0b3b68462ad73df43fd9e5479b03d6&contract=Bruxelles-Capitale";

let out = new VilloJSONConverter(villo_url);

let a = out.convert().then(
    (e) => new JSONWriter().write(e, "./test.json")
);

console.log("Done.")

//console.log(a);




