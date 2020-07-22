const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../scripts/cache');
const GeoFilter = require('../scripts/filtering');
const sortJsonArray = require('sort-json-array');
const validator = require('validator');

router.get('/bicycle-parking', (req, res) => bicycleParking(req, res));
router.get('/villo-stations', (req, res) => villoStation(req, res));
router.get('/air-pump', (req, res) => airPump(req, res));
router.get('/bicycle-repair-station', (req, res) =>
	bicycleRepairStation(req, res)
);
router.get('/bicycle-shop', (req, res) => bicycleShop(req, res));
router.get('/drinking-water', (req, res) => drinkingWater(req, res));

router.get('/endpoints', (req, res) => getMapEndpoints(req, res));
router.get('/current-street', (req, res) => reverseGeocode(req, res));

async function getFilteredData(req, res, key, icon, title) {
	let data;
	if (!validate(req)) {
		return res.status(400).json({ error: 'query not valid' });
	}

	if (cache.get(key)) {
		data = cache.get(key);
	} else {
		return res.status(500).json({ error: 'internal server error' });
	}

	let filtered_data = mapfilter(
		data,
		req.query.lat,
		req.query.lng,
		req.query.radius,
		req.query.max_answers
	);

	filtered_data.icon = icon;
	filtered_data.title = title;

	console.log(filtered_data);

	return res.status(200).json(filtered_data);
}

async function bicycleParking(req, res) {
	const key = 'bicycle_parking';
	const title = 'Bicycle parking';
	const icon = 'bicycle_parking.svg';

	return getFilteredData(req, res, key, icon, title);
}

async function villoStation(req, res) {
	const key = 'villo_station';
	const icon = 'villo_station.svg';
	const title = 'Villo station';
	return getFilteredData(req, res, key, icon, title);
}

async function airPump(req, res) {
	const key = 'compressed_air';
	const icon = 'compressed_air.svg';
	const title = 'Air pump';
	return getFilteredData(req, res, key, icon, title);
}

async function bicycleRepairStation(req, res) {
	let key = 'bicycle_repair_station';
	const icon = 'bicycle_repair_station.svg';
	const title = 'Repair station';
	return getFilteredData(req, res, key, icon, title);
}

async function bicycleShop(req, res) {
	let key = 'bicycle_shop';
	const icon = 'bicycle_shop.svg';
	const title = 'Bicycle shop';
	return getFilteredData(req, res, key, icon, title);
}

async function drinkingWater(req, res) {
	let key = 'drinking_water';
	const icon = 'drinking_water.svg';
	const title = 'Water tap';
	return getFilteredData(req, res, key, icon, title);
}

async function getMapEndpoints(req, res) {
	let endpoints = router.stack.map((x) => '/api/v1/map' + x.route.path);
	res.status(200).json({
		success: endpoints.filter(
			(e) => e !== '/api/v1/map/endpoints' && e !== '/api/v1/map/current-street'
		),
	});
}

async function reverseGeocode(req, res) {
	if (
		req.query.lat &&
    req.query.lng &&
    !validator.isEmpty(req.query.lat) &&
    validator.isDecimal(req.query.lat) &&
    !validator.isEmpty(req.query.lng) &&
    validator.isDecimal(req.query.lng)
	) {
		try {
			var data = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${req.query.lat}&lon=${req.query.lng}&format=json`
			);
		} catch (err) {
			console.log(err);
			return res.status(500).json({ error: 'internal server error' });
		}
		console.log(data.data.address);
		let street = data.data.address.road;
		let n = street.search(' - ');

		if (n == -1) {
			return res
				.status(200)
				.json({ streetname_fr: street, streetname_nl: street });
		}

		return res.status(200).json({
			streetname_fr: street.substr(0, n),
			streetname_nl: street.substr(n + 3),
		});
	}
	return res.status(400).json({ error: 'query not valid' });
}

function fetch(url) {
	return axios.get(url);
}

function mapfilter(data, lat, lng, radius, max_answers) {
	let filter = new GeoFilter(data);

	let filtered_data = filter.filter(lat, lng, radius, max_answers);

	filtered_data.features = sortJsonArray(
		filtered_data.features,
		'radians',
		'asc'
	);
	if (filtered_data.features.length > max_answers) {
		filtered_data.features.length = max_answers;
	}

	return filtered_data;
}

function validate(req) {
	if (
		req.query.lat &&
    req.query.lng &&
    req.query.radius &&
    req.query.max_answers &&
    !validator.isEmpty(req.query.lat) &&
    validator.isDecimal(req.query.lat) &&
    !validator.isEmpty(req.query.lng) &&
    validator.isDecimal(req.query.lng) &&
    !validator.isEmpty(req.query.radius) &&
    !validator.isEmpty(req.query.max_answers)
	) {
		return true;
	} else {
		return false;
	}
}

module.exports = router;
