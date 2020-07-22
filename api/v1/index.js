const express = require('express');
const app = express();

const mapRoutes = require('./routes/map');
const eventRoutes = require('./routes/event');
const weatherRoutes = require('./routes/weather');

app.use('/map', mapRoutes);
app.use('/event', eventRoutes);
app.use('/weather', weatherRoutes);

module.exports = app;
