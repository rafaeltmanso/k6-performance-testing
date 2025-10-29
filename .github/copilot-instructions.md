# Copilot Instructions for curso-k6-basico

## Project Overview

This is a k6 performance testing course project featuring a Node.js User API with MongoDB backend. The project demonstrates performance testing concepts and requirements (response time, concurrent users, error rates) using k6.

**Architecture**: Express REST API (`api/`) + k6 performance tests (`tests/`)

## Key Components

### API Service (`api/`)
- **Entry point**: `api/src/server.js` (obfuscated code)
- **Port**: 3333 (default) or set via `PORT` env var
- **Routes**: Defined in `api/src/routes.js` using Celebrate/Joi validation (code is obfuscated)
  - `GET /` → app metadata (version, beta flag)
  - `POST /signup` → user registration with `{email, password}` validation
- **Controller**: `api/src/controllers/UserController.js`
  - Hashes passwords using MD5 (via `md5` package)
  - Implements artificial delay via `process.env.TIMEOUT` for testing response times
  - Returns 400 on duplicate email (MongoDB error code 11000)
- **Model**: `api/src/models/User.js` (Mongoose schema with unique email constraint)

### Database
- MongoDB via Mongoose (v5.7.0)
- Connection string: `process.env.MONGO_URL` from `api/src/.env`
- Required env file template:
  ```
  MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
  TIMEOUT=2000  # optional: artificial delay in ms
  PORT=3333     # optional
  ```

### k6 Performance Tests (`tests/`)
- **Test suite structure**: Complete set of performance test types following k6 best practices
  - `smoke.js` → Minimal load test (1 VU, 1 minute) for basic functionality verification
  - `signup.js` → Standard load test (10 VUs, 30 seconds) for typical scenarios  
  - `signup-load.js` → Load test with ramp patterns (stages: 1m to 100 VUs, 2m steady, 1m down)
  - `signup-stress.js` → Stress test (stages: 10m to 200 VUs, 30m steady, 5m down)
  - `signup-soak.js` → Endurance test (stages: 5m to 100 VUs, 2h steady, 5m down)
  - `signup-spike.js` → Spike test (stages: 2m to 2000 VUs, immediate 1m down)
- **Shared patterns across all tests**:
  - Use `export const options = {...}` for test configuration
  - Import k6 modules: `http`, `sleep`, `check`, etc.
  - Generate unique emails via `uuid.v4().substring(24)@qa.com.br` pattern
  - Consistent thresholds: `http_req_duration: ['p(95)<2000']`, `http_req_failed: ['rate<0.01']`
  - HTML reports generated with date stamps in `./reports/` directory
- **UUID generation**: Custom bundled UUID library in `tests/libs/uuid.js` (obfuscated ES5 code)
- **Report generation**: Uses htmlReport + textSummary with date-stamped filenames

## Development Workflow

### Running the API
```bash
cd api
yarn install  # project uses Yarn via corepack enable
yarn dev       # uses nodemon for auto-reload
# OR
yarn start     # production mode
```

### Running k6 Tests
```bash
# Basic test execution
k6 run tests/smoke.js
k6 run tests/signup.js

# Test type examples
k6 run tests/signup-load.js    # Load testing
k6 run tests/signup-stress.js  # Stress testing  
k6 run tests/signup-soak.js    # Endurance testing
k6 run tests/signup-spike.js   # Spike testing

# All tests generate HTML reports in tests/reports/ with date stamps
```

### Manual API Testing
```bash
# Example from test.sh
curl --request POST \
  --url http://localhost:3333/signup \
  --header 'Content-Type: application/json' \
  --data '{"email": "test@example.com", "password": "securePassword123"}'
```

## Non-Functional Requirements (NFRs)

The project explicitly tracks performance NFRs (see README.md):
- Response time: ≤2 seconds for signup operations
- Concurrency: Support 100 simultaneous users
- Error margin: ≤1%

When creating k6 tests, reference these NFRs using k6's thresholds and checks.

## Important Conventions

- **Obfuscated source**: API source files are obfuscated but functional. Avoid editing them directly unless specifically requested.
- **Language**: README and documentation in Portuguese (Brazilian)
- **No linting/testing**: No eslint, prettier, or unit test framework configured in `api/package.json`
- **Package manager**: Project uses Yarn (via corepack) per README instructions
- **Password security**: Uses MD5 hashing (not cryptographically secure, for educational purposes only)

## When Writing k6 Tests

1. Import from k6 modules: `import http from 'k6/http'`, `import { check, sleep } from 'k6'`
2. Define test configuration via `export const options = { vus: X, duration: 'Xs' }`
3. Target localhost:3333 by default
4. Use `check()` to validate responses match expected status codes and structure
5. Reference the NFRs when setting thresholds (e.g., `http_req_duration: ['p(95)<2000']`)
6. Generate unique emails using: `${uuid.v4().substring(24)}@qa.com.br`
7. Include `handleSummary()` function for HTML and console reports with date stamps
