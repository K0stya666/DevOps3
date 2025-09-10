import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // разогрев
        { duration: '1m', target: 50 },    // основная нагрузка
        { duration: '30s', target: 100 },  // пик
        { duration: '30s', target: 0 },    // спад
    ],
    thresholds: {
        http_req_duration: ['p(95)<800'], // 95% запросов быстрее 800ms
        http_req_failed: ['rate<0.05'],   // <5% ошибок
    },
};

export default function () {
    const res = http.get('http://localhost:8080/api/books');
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}
