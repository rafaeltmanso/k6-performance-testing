import http from 'k6/http'
import { check } from 'k6'
import { sleep } from 'k6'
import uuid from './libs/uuid.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up to 100 users over 1 minute
    { duration: '2m', target: 100 }, // stay at 100 users for 2 minutes
    { duration: '1m', target: 0 }, // ramp down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2000ms
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
  },
}

export default function () {
  const url = 'http://localhost:3333/signup'
  const payload = JSON.stringify({
    email: `${uuid.v4().substring(24)}@qa.com.br`,
    password: 'securePassword123',
  })

  const headers = { 'Content-Type': 'application/json' }

  const res = http.post(url, payload, { headers })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })

  sleep(1)
}

export function handleSummary(data) {
  const date = new Date().toISOString().split('T')[0]
  return {
    [`./reports/signup-load-${date}.html`]: htmlReport(data, {
      theme: 'bootswatch:darkly',
    }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
