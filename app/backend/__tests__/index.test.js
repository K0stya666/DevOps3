const request = require('supertest');

jest.mock('prom-client'); // ????????? __mocks__/prom-client.js

describe('bootstrap & basic endpoints', () => {
    let app;
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        app = require('../index'); // ????o: index.js ?????? ?????????????? app
    });

    it('GET /health -> 200 OK', async () => {
        const r = await request(app).get('/health');
        expect(r.status).toBe(200);
        expect(r.text).toBe('OK');
    });

    it('GET /metrics -> 200 + text/plain', async () => {
        const r = await request(app).get('/metrics');
        expect(r.status).toBe(200);
        expect(r.headers['content-type']).toMatch(/text\/plain/);
        expect(r.text).toBe('metrics'); // ?? ????
    });

    it('GET /unknown -> 404 JSON', async () => {
        const r = await request(app).get('/no-such');
        expect(r.status).toBe(404);
        expect(r.body).toEqual({ message: 'Not Found' });
    });
});
