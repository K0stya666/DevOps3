// Jest подхватит это при jest.mock('prom-client')
const fakeRegister = {
    contentType: 'text/plain; version=0.0.4',
    metrics: jest.fn(async () => 'metrics'),
    registerMetric: jest.fn(),
    clear: jest.fn()
};

class Registry {
    constructor() { return fakeRegister; }
}

class Histogram {
    constructor() {}
    startTimer() { return jest.fn(); }
}

const collectDefaultMetrics = jest.fn();

module.exports = {
    Registry,
    Histogram,
    collectDefaultMetrics,
    register: fakeRegister
};
