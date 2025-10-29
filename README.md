# Performance Testing with k6 

<div align="left">
    <img src="https://img.shields.io/badge/k6-7D64FF?style=for-the-badge&logo=k6&logoColor=white" alt="k6">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</div>

> **📚 Study Project** - This is an educational project for learning performance testing using k6.

## 📖 About the Project

This repository contains a complete implementation of performance tests using **k6**, applied to a user registration REST API. The project demonstrates different types of load, stress, soak (endurance), and spike testing, following industry best practices.

### 🎯 Objective

Learn and practice performance testing concepts, including:

- Test scenario configuration (VUs, duration, stages)
- Defining and validating thresholds (performance limits)
- Generating HTML reports with detailed metrics
- Analyzing non-functional requirements (NFRs)

### ⚠️ Important Note about Metrics

**The metrics and success parameters defined in this project were established by me for study purposes.**

In a real-world scenario, performance criteria (response times, simultaneous user capacity, acceptable error rates) **must always be decided together with developers, architects, product owners, and the entire technical team**, based on:

- Business requirements
- Infrastructure capacity
- SLAs (Service Level Agreements)
- Expected user experience
- Cost vs. performance analysis

---

## 🏗️ Architecture

The project consists of two main parts:

```text
k6-performance-testing/
├── api/                    # User REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── server.js      # Express server
│   │   ├── routes.js      # API routes
│   │   ├── controllers/   # Business logic
│   │   └── models/        # Mongoose models
│   └── package.json
└── tests/                  # k6 performance tests
    ├── smoke.js           # Smoke test (1 VU, 1m)
    ├── signup.js          # Basic load test (10 VUs, 30s)
    ├── signup-load.js     # Load test (100 VUs)
    ├── signup-stress.js   # Stress test (200 VUs)
    ├── signup-soak.js     # Endurance test (100 VUs, 2h)
    ├── signup-spike.js    # Spike test (2000 VUs)
    ├── libs/uuid.js       # UUID library to generate unique emails
    └── reports/           # Generated HTML reports
```

---

## 🔖 Functional Requirements

### User Registration

- [X] Must return the ID when registering a new user
- [X] Must return status 201 on successful registration
- [X] Must return status 400 when trying to register without email and password
- [X] Must return status 400 if the email is duplicated

### API Fields

| Field    | Description              | Type     | Required |
|:---------|:------------------------|:---------|:---------|
| email    | Unique user identifier   | email    | ✅ Yes   |
| password | User password           | text     | ✅ Yes   |

**Endpoint**: `POST /signup`

**Request example**:
```json
{
  "email": "usuario@example.com",
  "password": "securePassword123"
}
```

---

## 🔖 Non-Functional Requirements (NFRs)

### Performance - User Registration

- [ ] Successful registration must occur within **2 seconds** (p95)
- [ ] Failed registrations must occur within **2 seconds** (p95)
- [ ] Must support up to **100 simultaneous users**
- [ ] The error margin for registration must be less than **1%**

### Implemented Thresholds

All tests use the following k6 thresholds:

```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2000ms
  http_req_failed: ['rate<0.01'],    // HTTP error rate must be less than 1%
}
```

---

## 🧪 Implemented Test Types

### 1. **Smoke Test** (`smoke.js`)

- **Objective**: Minimal functionality verification
- **Configuration**: 1 VU for 1 minute
- **Usage**: Validate that the system works before heavier tests

### 2. **Load Test - Basic** (`signup.js`)

- **Objective**: Standard load test
- **Configuration**: 10 VUs for 30 seconds
- **Usage**: Validate behavior under typical load

### 3. **Load Test - Ramped** (`signup-load.js`)

- **Objective**: Load test with ramp pattern
- **Configuration**:
  - 1min: ramp from 0 → 100 VUs
  - 2min: maintain 100 VUs
  - 1min: ramp from 100 → 0 VUs
- **Usage**: Evaluate behavior during load increase and decrease

### 4. **Stress Test** (`signup-stress.js`)

- **Objective**: Identify system limits
- **Configuration**:
  - 10min: ramp from 0 → 200 VUs
  - 30min: maintain 200 VUs
  - 5min: ramp from 200 → 0 VUs
- **Usage**: Find the system's breaking point

### 5. **Soak Test / Endurance Test** (`signup-soak.js`)

- **Objective**: Verify long-term stability
- **Configuration**:
  - 5min: ramp from 0 → 100 VUs
  - 2h: maintain 100 VUs
  - 5min: ramp from 100 → 0 VUs
- **Usage**: Detect memory leaks and performance degradation

### 6. **Spike Test** (`signup-spike.js`)

- **Objective**: Evaluate behavior with sudden spike
- **Configuration**:
  - 2min: fast ramp from 0 → 2000 VUs
  - 1min: ramp from 2000 → 0 VUs
- **Usage**: Test resilience to sudden traffic spikes

---

## 🚀 Technologies

### Backend API

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express](https://expressjs.com/)** - Web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - ODM for MongoDB
- **[Celebrate](https://github.com/arb/celebrate)** - Data validation (Joi)
- **[MD5](https://www.npmjs.com/package/md5)** - Password hashing (study purposes only)

### Performance Testing

- **[k6](https://k6.io/)** - Modern open-source performance testing tool by Grafana Labs
- **[k6-reporter](https://github.com/benc-uk/k6-reporter)** - HTML report generation

---

## 👨🏻‍💻 How to Run the Project

### Prerequisites

- **[Node.js](https://nodejs.org/)** v16 or higher
- **[MongoDB](https://www.mongodb.com/)** (local or MongoDB Atlas)
- **[k6](https://k6.io/docs/get-started/installation/)** installed
- **[Yarn](https://yarnpkg.com/)** (via corepack)

### 1️⃣ Setup the Backend

#### Enable Yarn (if necessary)

```bash
corepack enable
```

#### Install dependencies

```bash
cd api
yarn install
```

#### Configure environment variables

Create a `.env` file in `api/src/.env` with the following content:

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
TIMEOUT=2000  # Optional: artificial delay in ms to simulate processing
PORT=3333     # Optional: server port (default: 3333)
```

#### Run the API

**Development mode** (with hot-reload):

```bash
yarn dev
```

**Production mode**:

```bash
yarn start
```

The API will be available at `http://localhost:3333`

### 2️⃣ Run k6 Tests

#### Basic test (smoke test)

```bash
k6 run tests/smoke.js
```

#### Standard load test

```bash
k6 run tests/signup.js
```

#### Ramped load test

```bash
k6 run tests/signup-load.js
```

#### Stress test

```bash
k6 run tests/signup-stress.js
```

#### Endurance test (soak)

```bash
k6 run tests/signup-soak.js
```

#### Spike test

```bash
k6 run tests/signup-spike.js
```

### 3️⃣ View Reports

After each execution, an HTML report is generated in `tests/reports/` with the name:

```text
{test-name}-{YYYY-MM-DD}.html
```

Example: `signup-load-2025-10-29.html`

Open the HTML file in a browser to view:

- Detailed metrics (min, max, avg, p90, p95, p99)
- Performance graphs
- Check results
- Threshold status

---

## 🧪 Testing the API Manually

### Using cURL

```bash
curl --request POST \
  --url http://localhost:3333/signup \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "test@example.com",
    "password": "securePassword123"
  }'
```

### Success response (201)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "test@example.com"
}
```

### Error response - Duplicate email (400)

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Email already exists"
}
```

---

## 📊 k6 Test Structure

All tests follow the same pattern:

```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'
import uuid from './libs/uuid.js'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

// Test configuration
export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
}

// Function executed by each VU
export default function () {
  const url = 'http://localhost:3333/signup'
  const payload = JSON.stringify({
    email: `${uuid.v4().substring(24)}@qa.com.br`, // Unique email
    password: 'securePassword123',
  })
  const headers = { 'Content-Type': 'application/json' }

  const res = http.post(url, payload, { headers })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })

  sleep(1) // Simulates user "think time"
}

// Report generation
export function handleSummary(data) {
  const date = new Date().toISOString().split('T')[0]
  return {
    [`./reports/signup-${date}.html`]: htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
```

---

## 🎓 Learnings and Concepts

### What is k6?

k6 is a modern open-source performance testing tool that allows you to:

- Write tests in JavaScript
- Run tests locally or in CI/CD
- Generate detailed and accurate metrics
- Easily scale from a few to thousands of virtual users

### Important Concepts

**VU (Virtual User)**: Represents a virtual user executing the test script

**Iteration**: One complete execution of the `default` function by a VU

**Stage**: Test phase with specific configuration (ramp up/down, plateau)

**Threshold**: Test success/failure criterion (e.g., p95 < 2s)

**Check**: Response validation (similar to assertions)

**Metric**: Measurement collected by k6 (req duration, req rate, etc.)

### Main k6 Metrics

- `http_req_duration`: Total request time
- `http_req_waiting`: Time waiting for server response (TTFB)
- `http_req_connecting`: TCP connection establishment time
- `http_req_sending`: Time sending data
- `http_req_receiving`: Time receiving data
- `http_req_failed`: Failed request rate
- `http_reqs`: Total HTTP requests
- `vus`: Number of active VUs
- `iterations`: Total completed iterations

---

## 🙏 Acknowledgments

### API Backend

The **User API** used in this project was developed by **Fernando Papito** ([papitodev](https://github.com/papitodev)).

A special thanks to Fernando for providing this educational resource that enables realistic and effective performance testing practice.

🔗 **Fernando's Contact**:

- GitHub: [papitodev](https://github.com/papitodev)
- LinkedIn: [Fernando Papito](https://www.linkedin.com/in/qapapito/)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributions

This is a study project, but suggestions and improvements are welcome! Feel free to:

- Report bugs
- Suggest new test scenarios
- Improve documentation
- Share your test results

---

**Developed with 💜 for educational purposes**
