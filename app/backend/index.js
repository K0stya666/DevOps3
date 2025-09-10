const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const client = require('prom-client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


// prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpReqDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});
register.registerMetric(httpReqDuration);

app.use((req, res, next) => {
    const end = httpReqDuration.startTimer({ method: req.method });
    res.on('finish', () => {
        const route = req.route?.path || req.path || 'unknown_route';
        end({ route, status_code: res.statusCode });
    });
    next();
});

app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});


// ??????????? ?????????
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

app.get('/health', (_req, res) => res.sendStatus(200));

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}