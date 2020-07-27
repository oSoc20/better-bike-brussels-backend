# BetterBikeBrusselsBackend

## Deployment

You can use Docker to install BetterBikeBackend. For information about the installation using Docker, please refer to the following sections. 

If you don't want to use Docker, you need to install `nodejs`. The software has been tested with Node.js version 14.

Then, run the app with the following command on the root directory of the source code:

```bash
node .
```

### Installation from DockerHub

![Docker Image Version (latest by date)](https://img.shields.io/docker/v/lavendthomas/betterbikebrusselsbackend)

Pull the latest available container, here `20200727`:

```bash
docker pull lavendthomas/betterbikebrusselsbackend:20200727
```

Then, launch the container:

```bash
docker run --name betterbikebusselsbackend -p 8080:8080 -d <image_id>
```

You can change the port of the API by changing the second number of the `-p` option. The default is `8080`.

### Build the Docker container from source

First set a `PORT` environment variable for your desired port.

```bash
export PORT=8080    # choose your port here
```

Official events are gathered from the [API.brussels](https://api.brussels/store/). You need to create an account, and generate an API key.

Weather information is collected from [OpenWeatherMap](https://openweathermap.org/). You also need to create a free account and generate an API key.

Create `config.js` in the root directory containing:

```js
module.exports = {
  env: {
    APIBRUSSELS_API_KEY: "Bearer YOUR_KEY",
    OPENWEATHERMAP_API_KEY: 'YOUR_KEY'
  },
};
```


Once this is done, you can finally build the docker image:

```bash
docker build -t <your-id>/betterbikebusselsbackend .
```

You now have built the container, follow the instructions in the previous sections, without pulling the container from DockerHub.




## API Documentation

### Points of interests to show on the map

The default port is 8080, but can be changed in `app.js`. We will use PORT in the following document.

A list of all endpoints, i.e. data sources can be found at:

```
https://HOST:PORT/api/v1/map/endpoints
```

A JSON file containing a list of the avaiaible data points will be sent back.

For example:

```json
{
  "success": [
    "/api/v1/map/bicycle-parking",
    "/api/v1/map/villo-stations",
    "/api/v1/map/air-pump",
    "/api/v1/map/bicycle-repair-station",
    "/api/v1/map/bicycle-shop",
    "/api/v1/map/drinking-water"
  ]
}
```

#### Datasets

To receive to full dataset about an enpoints, send a request using the path in the `endpoints` request:

```
https://HOST:PORT/api/v1/map/villo-stations
```

A GeoJSON file will be sent back, in this case containing all Villo! Stations.

#### Filter Datasets

The API supports multiple URL parameters:

| Parameter     | Description                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| `lat`         | The latitude of the center of the search.                                                     |
| `lng`         | The longitude of the center of the search.                                                    |
| `radius`      | The radius of the search.                                                                     |
| `max_answers` | The maximum number of answers sent back. Results are sorted from the closest to the furthest. |

This allows the client to request only relevant, local data.

The answer will still be a GeoJSON file, but filtered to contain only data according to the URL parameters.

For example, a filtered request could be:

```
https://HOST:PORT/api/v1/map/villo-stations?lat=4.41505&lng=50.836304&radius=100&max_answers=10
```

#### Current Location

To receive the current street name, send a request using `current-street` endpoint:

```
https://HOST:PORT/api/v1/map/current-street
```

as query parameter, you will need to add the lat & lng parameters to send over your current location. f.e.:

```
https://HOST:PORT/api/v1/map/current-street?lat=50.84889&lng=4.34930
```

### Events

There are two types of events, official events and user-generated events.

#### Official events



You can request the list of all bike-related events:

```
https://HOST:PORT/api/v1/event/official
```

#### Filter events

You can filter events using URL parameters:

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `from`    | Unix Epoch timestamp from which events should be sent.  |
| `to`      | Unix Epoch timestamp until which events should be sent. |

For example, a request between January 1st, 2020 and July 31st, 2020 is:

```
https://HOST:PORT/api/v1/event/official?from=1577836800&to=1596239999
```
