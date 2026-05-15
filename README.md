# CareerStack — Job Portal

A full-stack job portal built with **Django REST Framework**, **React**, and **React Native (Expo)**. The platform supports two user roles — Employers and Job Seekers — with real-time email notifications, application tracking, and a cross-platform mobile app.

---

## 🔗 Links

| | 🌐 Live | 📄 API Docs | 💻 GitHub |
|---|---|---|---|
| 🖥️ **Web Frontend** | [Live App](https://job-portal-career-stack-frontend.vercel.app) | — | [Frontend Repo](https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Frontend) |
| ⚙️ **Backend** | [API](https://job-portal-careerstack-backend-production.up.railway.app) | [Swagger](https://job-portal-careerstack-backend-production.up.railway.app/swagger/) | [Backend Repo](https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Backend) |
| 📱 **Mobile App** | Expo Go | — | [App Repo](https://github.com/Dhanashree-Raut/job-portal-app) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend language | Python 3.11+ |
| Backend framework | Django / Django REST Framework |
| Authentication | JWT via `djangorestframework-simplejwt` |
| Database | PostgreSQL (Neon) |
| Task queue | Celery + Redis |
| Email | Gmail SMTP via Django email backend |
| API documentation | `drf-yasg` — Swagger UI |
| Web frontend | React 18 + React Bootstrap |
| Mobile app | React Native + Expo (file-based routing) |
| HTTP client | Axios |
| Deployment | Railway (backend) · Vercel (frontend) |

---

## Features

### Backend
- JWT authentication with access and refresh tokens
- Two-role system — Job Seeker and Employer
- Full CRUD for job postings (employers only)
- Job application system with cover letter support
- Application status management — pending, reviewed, shortlisted, rejected, accepted
- Celery-powered async email notifications for all key events
- Company profile management per employer
- Job filtering by type, location, experience level, and keyword search
- Swagger UI at `/swagger/`

### Web Frontend (React)
- Login and registration with role selection
- Job listing with search and filters
- Already-applied badge on job cards and job detail page
- Job detail page with company info and apply modal
- Job Seeker dashboard — application tracking with status and employer notes
- Employer dashboard — post jobs, edit jobs inline, update application status
- Employer company profile modal — update company name, website, description
- Dark/light theme support

### Mobile App (React Native + Expo)
- Cross-platform — Android and iOS
- Login and registration with role selection
- Job listing with search and already-applied badge
- Job detail page with status card and employer note when already applied
- Job Seeker dashboard — application list with status badges and employer notes
- Employer dashboard — post jobs, edit jobs, view applications per job
- Employer company profile edit modal
- Auto token refresh and persistent auth via AsyncStorage

---

## Email Notifications

| Trigger | Recipients |
|---|---|
| Account created | New user — welcome email with account details |
| Job posted | Employer — job is now live confirmation |
| Job seeker applies | Employer — new application received |
| Job seeker applies | Job seeker — application submitted confirmation |
| Application status updated | Job seeker — status update with employer note |

---

## Role Permission Matrix

| Action | Job Seeker | Employer |
|---|---|---|
| Browse jobs | ✓ | ✓ |
| Apply to jobs | ✓ | ✗ |
| Track own applications | ✓ | ✗ |
| Post jobs | ✗ | ✓ |
| Edit own jobs | ✗ | ✓ |
| View job applications | ✗ | ✓ |
| Update application status | ✗ | ✓ |
| Edit company profile | ✗ | ✓ |

---

## Project Structure

```
job-portal/
├── backend/
│   ├── accounts/               User model, auth views, JWT
│   │   ├── models.py           Custom User with role, company fields, skills
│   │   ├── serializers.py
│   │   ├── views.py            Register, Login, Logout, Profile
│   │   └── urls.py
│   ├── jobs/                   Job and Application logic
│   │   ├── models.py           Job, Application models
│   │   ├── serializers.py
│   │   ├── views.py            CRUD + apply + status update
│   │   ├── permissions.py      IsEmployer, IsJobSeeker
│   │   └── urls.py
│   ├── notifications/          Celery email tasks
│   │   └── tasks.py            5 async email tasks
│   ├── jobboard/               Django project config
│   │   ├── settings.py
│   │   ├── celery.py
│   │   └── urls.py
│   ├── jobs/management/
│   │   └── commands/
│   │       └── seed_data.py    Fake seed data command
│   └── requirements.txt
│
├── frontend/                   React web app
│   └── src/
│       ├── api/axios.js
│       ├── context/AuthContext.js
│       ├── components/Navbar.js
│       └── pages/
│           ├── Home.js
│           ├── JobDetail.js
│           ├── EmployerDashboard.js
│           ├── JobSeekerDashboard.js
│           ├── Login.js
│           └── Register.js
│
└── mobile/                     React Native Expo app
    ├── app/
    │   ├── (auth)/
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   └── _layout.tsx
    │   ├── (tabs)/
    │   │   ├── index.tsx        Job listing
    │   │   ├── dashboard.tsx    Seeker + Employer dashboards
    │   │   ├── post-job.tsx
    │   │   └── _layout.tsx
    │   ├── employer/
    │   │   └── applications.tsx
    │   └── jobs/
    │       └── [id].tsx         Job detail
    └── src/
        ├── api/axios.ts
        ├── context/AuthContext.tsx
        └── components/JobCard.tsx
```

---

## Data Models

### User

| Field | Type | Description |
|---|---|---|
| `email` | EmailField | Unique — used as login |
| `username` | CharField | Display name |
| `role` | CharField | job_seeker or employer |
| `phone` | CharField | Optional |
| `skills` | TextField | Job seeker skills (comma separated) |
| `company_name` | CharField | Employer only |
| `company_website` | URLField | Employer only |
| `company_description` | TextField | Employer only |
| `resume` | FileField | Job seeker only |
| `profile_picture` | ImageField | Optional |

### Job

| Field | Type | Description |
|---|---|---|
| `employer` | ForeignKey | Linked employer user |
| `title` | CharField | Job title |
| `description` | TextField | Role description |
| `requirements` | TextField | Job requirements |
| `location` | CharField | City or Remote |
| `salary_min` | DecimalField | Optional |
| `salary_max` | DecimalField | Optional |
| `job_type` | CharField | full_time / part_time / contract / internship / remote |
| `experience_level` | CharField | entry / mid / senior |
| `skills_required` | TextField | Comma separated |
| `status` | CharField | active / closed / draft |
| `deadline` | DateField | Optional application deadline |

### Application

| Field | Type | Description |
|---|---|---|
| `applicant` | ForeignKey | Job seeker user |
| `job` | ForeignKey | Applied job |
| `cover_letter` | TextField | Optional |
| `resume` | FileField | Optional |
| `status` | CharField | pending / reviewed / shortlisted / rejected / accepted |
| `employer_note` | TextField | Optional note from employer |
| `applied_at` | DateTimeField | Auto-set |

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Register new user |
| POST | `/api/accounts/login/` | Get access and refresh tokens |
| POST | `/api/accounts/logout/` | Blacklist refresh token |
| GET / PATCH | `/api/accounts/profile/` | View or update own profile |
| POST | `/api/accounts/token/refresh/` | Refresh access token |

### Jobs

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/jobs/` | All | List active jobs with filters |
| POST | `/api/jobs/` | Employer | Create a job |
| GET | `/api/jobs/{id}/` | All | Job detail |
| PUT | `/api/jobs/{id}/` | Employer (owner) | Edit job |
| GET | `/api/jobs/my-jobs/` | Employer | Own job listings |
| POST | `/api/jobs/{id}/apply/` | Job Seeker | Apply to a job |
| GET | `/api/jobs/{id}/applications/` | Employer | Applications for a job |
| GET | `/api/jobs/my-applications/` | Job Seeker | Own applications |
| PUT | `/api/jobs/applications/{id}/status/` | Employer | Update application status |

**Job filter params:** `?job_type=full_time&location=Mumbai&experience_level=mid&search=python`

---

## Setup and Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- Redis (for Celery)
- PostgreSQL or Neon account

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Backend.git
cd Job-Portal-CareerStack-Backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac / Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file (see below)

# 5. Run migrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Seed fake data
python manage.py seed_data

# 8. Start Django
python manage.py runserver

# 9. Start Celery worker (separate terminal)
python -m celery -A jobboard worker --loglevel=info --pool=solo
```

**.env file:**
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host/dbname
REDIS_URL=redis://localhost:6379
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_PORT=587
DEFAULT_FROM_EMAIL=your@gmail.com
```

---

### Web Frontend Setup

```bash
# Clone the frontend repo
git clone https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Frontend.git
cd Job-Portal-CareerStack-Frontend

npm install
npm start
```

React app runs at `http://localhost:3000`.

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

---

### Mobile App Setup

```bash
# Clone the mobile repo
git clone https://github.com/Dhanashree-Raut/job-portal-app.git
cd job-portal-app

npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press:
- `a` — Android emulator
- `i` — iOS simulator
- `w` — Web browser

Update `baseURL` in `src/api/axios.ts`:
```ts
// Physical device — use your machine's local IP
baseURL: 'http://192.168.x.x:8000'

// Emulator
baseURL: 'http://localhost:8000'
```

---

## Running Everything Together

```bash
# Terminal 1 — Django backend
python manage.py runserver

# Terminal 2 — Celery worker
python -m celery -A jobboard worker --loglevel=info --pool=solo

# Terminal 3 — React web
cd frontend && npm start

# Terminal 4 — Expo mobile
cd mobile && npx expo start
```

| Service | URL |
|---|---|
| Django API | http://127.0.0.1:8000/api/ |
| Swagger UI | http://127.0.0.1:8000/swagger/ |
| Django Admin | http://127.0.0.1:8000/admin/ |
| React Web | http://localhost:3000 |
| Expo Mobile | Scan QR from terminal |

---

## Seed Data Credentials

Run `python manage.py seed_data` to load fake employers and job seekers.

**All passwords:** `Test@1234`

| Role | Email |
|---|---|
| Employer | hr@careerstackmailinfosys.com |
| Employer | careers@careerstacktcs.com |
| Employer | jobs@careerstackflipkart.com |
| Employer | talent@careerstackrazorpay.com |
| Employer | hr@careerstackzomato.com |
| Job Seeker | arjun.sharma@careerstackmail.com |
| Job Seeker | priya.mehta@careerstackmail.com |
| Job Seeker | rahul.verma@careerstackmail.com |
| Job Seeker | neha.joshi@careerstackmail.com |
| Job Seeker | karan.patel@careerstackmail.com |
| Job Seeker | sneha.rao@careerstackmail.com |
| Job Seeker | amit.singh@careerstackmail.com |
| Job Seeker | divya.kumar@careerstackmail.com |

---

## Error Handling

| Status | Meaning |
|---|---|
| `200 OK` | Success |
| `201 Created` | Resource created |
| `400 Bad Request` | Validation error |
| `401 Unauthorized` | Missing or expired token |
| `403 Forbidden` | Wrong role |
| `404 Not Found` | Resource not found |

---

## Design Decisions

| Area | Decision |
|---|---|
| Email as login | More user-friendly than username for a job portal |
| Celery for emails | Email sending is async — API response is never blocked by SMTP |
| Fake email domains | Seed users use `@careerstackmail.com` so no real emails are sent accidentally |
| `DEFAULT_FROM_EMAIL` in env | Single place to change the sender email across all tasks |
| `fail_silently=False` in tasks | Errors are logged via Celery — task retries can be added later |
| Company info on User model | Simpler than a separate Company model for this scale |

---

## Author

Built as a full-stack portfolio project demonstrating REST API design, role-based access, async task queues, and cross-platform mobile development.

**Stack:** Python · Django REST Framework · React 18 · React Native · Expo · PostgreSQL · Celery · Redis · JWT