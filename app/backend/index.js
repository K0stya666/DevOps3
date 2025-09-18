const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books');
const promClient = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// метрики
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpReqDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});
register.registerMetric(httpReqDuration);

app.use((req, res, next) => {
    const end = httpReqDuration.startTimer({ method: req.method });
    res.on('finish', () => end({ route: req.route?.path || req.path, status_code: res.statusCode }));
    next();
});

app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.use('/api/books', booksRouter);
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// экспортируем app для тестов
module.exports = app;

// поднимаем сервер только вне тестов
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}
