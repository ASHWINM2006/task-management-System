# Task Management System

Full-stack Task Management application — FastAPI + React + SQLite.

---

## Quick Start (Windows)

```bat
setupdev.bat       :: installs everything
runapplication.bat :: starts both servers
```

| URL | Service |
|-----|---------|
| http://localhost:3000 | React frontend |
| http://localhost:8000/docs | Swagger UI |
| http://localhost:8000/openapi.json | OpenAPI schema |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, JavaScript, CSS |
| HTTP client | Axios |
| Backend | Python FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy 2 |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Tests | pytest + FastAPI TestClient |
| SDK | OpenAPI Generator CLI |

---

## Folder Structure

```
task-management-system/
├── backend/
│   ├── main.py               FastAPI entry point
│   ├── database.py           Engine, session, get_db()
│   ├── models.py             Task, ActivityLog ORM models
│   ├── schemas.py            Pydantic schemas
│   ├── crud.py               DB access layer
│   ├── routes/
│   │   ├── tasks.py          /tasks endpoints
│   │   └── activity.py       /activity endpoint
│   ├── services/
│   │   └── status_service.py Status-transition validator
│   ├── tests/
│   │   ├── conftest.py       In-memory test DB fixture
│   │   └── test_tasks.py     52 pytest tests
│   ├── alembic/
│   │   └── versions/0001_initial_schema.py
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── seed_data.sql
│   └── seed_db.py
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── index.js / App.jsx
│       ├── services/api.js         Axios client
│       ├── hooks/useTasks.js       Central state + polling
│       ├── utils/helpers.js
│       ├── styles/global.css
│       ├── pages/Dashboard.jsx
│       └── components/
│           ├── StatsCards.jsx
│           ├── TaskFilters.jsx
│           ├── TaskList.jsx / TaskCard.jsx
│           ├── TaskFormModal.jsx
│           ├── DeleteConfirmModal.jsx
│           ├── Pagination.jsx
│           ├── ActivityLog.jsx
│           └── Notification.jsx
├── task_sdk/
│   ├── generate_sdk.bat
│   └── sdk_example.py
├── setupdev.bat
├── runapplication.bat
├── .gitignore
└── README.md
```

---

## Installation (Manual)

```bat
:: Backend
cd backend
py -m venv venv
venv\Scripts\activate
pip install --no-cache-dir -r requirements.txt
alembic upgrade head
python seed_db.py

:: Frontend
cd ..\frontend
npm install --legacy-peer-deps
```

---

## Running

```bat
:: Terminal 1 — backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

:: Terminal 2 — frontend
cd frontend
npm start
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /tasks/ | Create task (201) |
| GET | /tasks/ | List tasks (search/filter/sort/page) |
| GET | /tasks/stats | Dashboard stats |
| GET | /tasks/{id} | Get task (404 if missing) |
| PUT | /tasks/{id} | Update task (400 on bad transition) |
| DELETE | /tasks/{id} | Delete task |
| GET | /tasks/{id}/allowed-transitions | Valid next statuses |
| GET | /activity/ | Activity log |

### Query params for GET /tasks/

| Param | Default | Values |
|-------|---------|--------|
| search | — | text |
| status | — | pending / in-progress / completed |
| priority | — | low / medium / high |
| sort_by | created_at | created_at / title / due_date / priority / status |
| sort_order | desc | asc / desc |
| page | 1 | ≥1 |
| page_size | 20 | 1–100 |

---

## Status-Transition Rules

Enforced on the **backend** in `services/status_service.py` — frontend validation is for UX only.

```
pending     → pending        OK
pending     → in-progress    OK
in-progress → in-progress    OK
in-progress → completed      OK
completed   → completed      OK

pending     → completed      400
in-progress → pending        400
completed   → in-progress    400
completed   → pending        400
```

Updating title/description is always allowed regardless of status.

---

## Running Tests

```bat
cd backend
venv\Scripts\activate
pytest tests/ -v
```

52 tests, 0 failures — verified on Python 3.14.5.

---

## Python SDK

### 1. Download generator JAR

```bat
cd task_sdk
curl -L -o openapi-generator-cli.jar ^
  https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.5.0/openapi-generator-cli-7.5.0.jar
```

### 2. Start backend + generate

```bat
:: Start backend first, then:
task_sdk\generate_sdk.bat
```

### 3. Run example script

```bat
python task_sdk\sdk_example.py
```

The script also runs as an httpx fallback if the SDK is not yet generated.

---

## Example curl Requests

```bash
# Create
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'

# List
curl "http://localhost:8000/tasks/?status=pending&sort_by=title"

# Advance status
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'

# Invalid transition — returns 400
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"pending"}'

# Delete
curl -X DELETE http://localhost:8000/tasks/1
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `alembic: command not found` | Activate venv: `venv\Scripts\activate` |
| `no such table: tasks` | Run `alembic upgrade head` |
| Frontend "Network Error" | Confirm backend is on port 8000; check CORS |
| Port 8000 in use | `netstat -ano \| findstr :8000` then `taskkill /PID <pid> /F` |
| `npm install` fails | Add `--legacy-peer-deps` |
| SDK generation fails | Ensure backend is running before running generate_sdk.bat |

---

## Requirements → Implementation Checklist

| Requirement | File |
|-------------|------|
| POST /tasks/ | routes/tasks.py |
| GET /tasks/ | routes/tasks.py |
| GET /tasks/{id} | routes/tasks.py |
| PUT /tasks/{id} | routes/tasks.py |
| DELETE /tasks/{id} | routes/tasks.py |
| Status transition enforcement | services/status_service.py |
| SQLAlchemy models | models.py |
| Pydantic schemas | schemas.py |
| DB dependency injection | database.py → get_db() |
| Alembic migration | alembic/versions/0001_initial_schema.py |
| Seed data | seed_data.sql, seed_db.py |
| CORS | main.py CORSMiddleware |
| Swagger UI at /docs | FastAPI built-in |
| OpenAPI at /openapi.json | FastAPI built-in |
| HTTP 400 bad transition | status_service.py |
| HTTP 404 missing | routes/tasks.py _get_or_404 |
| Dashboard stats | StatsCards.jsx, useTasks.js |
| Create/Edit forms | TaskFormModal.jsx |
| Status buttons | TaskCard.jsx |
| Delete confirm | DeleteConfirmModal.jsx |
| Search/filter/sort | TaskFilters.jsx, crud.py |
| Pagination | Pagination.jsx |
| Notifications | Notification.jsx |
| Priority levels | models.py, schemas.py, TaskFormModal.jsx |
| Due dates + overdue | models.py, helpers.js, TaskCard.jsx |
| Progress indicator | StatsCards.jsx |
| Dark/light theme | App.jsx, global.css |
| CSV export | useTasks.js exportCSV() |
| Activity log | models.py, routes/activity.py, ActivityLog.jsx |
| Polling | useTasks.js setInterval 30s |
| pytest suite (52 tests) | tests/test_tasks.py |
| Isolated test DB | tests/conftest.py |
| SDK generation | task_sdk/generate_sdk.bat |
| SDK example | task_sdk/sdk_example.py |
| setupdev.bat | setupdev.bat |
| runapplication.bat | runapplication.bat |
