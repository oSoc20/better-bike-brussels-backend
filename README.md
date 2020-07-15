# BetterBikeBrusselsBackend

## API Documentation

### Endpoints

The default port is 3000, but can be changed in `app.js`. We will use PORT in the following 

A list of all endpoints, i.e. data sources can be found at:

```
https://HOST:PORT/api/v1/map/endpoints
```

A JSON file containing a list of the avaiaible data points will be sent back.

For example:
```json
{"success":
["/api/v1/map/bicycle-parking",
"/api/v1/map/villo-stations",
"/api/v1/map/air-pump",
"/api/v1/map/bicycle-repair-station",
"/api/v1/map/bicycle-shop",
"/api/v1/map/drinking-water"]}
```

### Datasets

To receive to full dataset about an enpoints, send a request using the path in the `endpoints` request:

```
https://HOST:PORT/api/v1/map/villo-stations
```

A GeoJSON file will be sent back, in this case containing all Villo! Stations.


### Filter Datasets

The API supports multiple URL parameters:

| Parameter     | Description                                                                                   |
|---------------|-----------------------------------------------------------------------------------------------|
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

### Current Location

To receive the current street name, send a request using `current-street` endpoint:

```
https://HOST:PORT/api/v1/map/current-street
```

as query parameter, you will need to add the lat & lng parameters to send over your current location. f.e.:

```
https://HOST:PORT/api/v1/map/current-street?lat=50.84889&lng=4.34930
```