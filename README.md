# 💼 Job Portal — CareerStack

A full-stack Job Board application built with Django REST Framework and React. Employers can post jobs and manage applications, while Job Seekers can browse, apply, and track their application status in real time.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🖥️ **Frontend** | https://job-portal-career-stack-frontend.vercel.app |
| ⚙️ **Backend API** | https://job-portal-careerstack-backend-production.up.railway.app |
| 📄 **Swagger Docs** | https://job-portal-careerstack-backend-production.up.railway.app/swagger/ |

---

## 📂 GitHub Repositories

| | Link |
|---|---|
| ⚛️ **Frontend Repo** | https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Frontend |
| 🐍 **Backend Repo** | https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Backend |

---

## 🚀 Features

### 🔐 Authentication
- JWT based authentication (Access + Refresh tokens)
- Role based access control — Job Seeker, Employer, Admin
- Register, Login, Logout, Change Password
- Token auto-refresh on expiry

### 👨‍💼 Job Seeker
- Browse and search all active job listings
- Filter by job type, location, experience level
- Apply to jobs with a cover letter
- Track application status in personal dashboard
- Email notifications when status is updated by employer

### 🏢 Employer
- Post and manage job listings
- View all applications per job
- Update application status — Pending, Reviewed, Shortlisted, Rejected, Accepted
- Leave notes for applicants
- Email notifications when someone applies

### 🎨 Frontend
- Dark Mode and Light Mode toggle
- Responsive design with Bootstrap
- Loading skeletons and spinners
- Role based navigation

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Django 6.0 | Web framework |
| Django REST Framework | REST API |
| Simple JWT | Authentication |
| PostgreSQL (Neon) | Production database |
| Celery | Background task queue |
| Redis Cloud | Message broker |
| Docker + Docker Compose | Containerization |
| Gunicorn | Production WSGI server |
| Whitenoise | Static file serving |
| drf-yasg | Swagger API documentation |
| pytest-django | Unit testing |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM | Client side routing |
| Axios | HTTP requests + interceptors |
| Bootstrap + React Bootstrap | Styling and components |
| Context API | Global state (Auth + Theme) |

### Deployment & Infrastructure
| Service | Purpose |
|---|---|
| Railway | Backend hosting |
| Vercel | Frontend hosting |
| Neon | Serverless PostgreSQL |
| Redis Cloud | Redis broker |
| GitHub | Version control |

---

## 📁 Project Structure

### Backend
```
Job-Portal-CareerStack-Backend/
├── accounts/               # User model, auth, profiles, roles
│   ├── models.py           # Custom User with roles
│   ├── serializers.py      # Register, Profile, ChangePassword
│   ├── views.py            # Register, Login, Logout, Profile
│   ├── urls.py
│   └── backends.py         # Email based auth backend
├── jobs/                   # Job listings and applications
│   ├── models.py           # Job, Application models
│   ├── serializers.py
│   ├── views.py            # CRUD + permissions
│   ├── permissions.py      # IsEmployer, IsJobSeeker, IsOwner
│   └── urls.py
├── notifications/          # Email notifications
│   └── tasks.py            # Celery tasks
├── jobboard/               # Project config
│   ├── settings.py
│   ├── urls.py             # Swagger + API routes
│   └── celery.py
├── tests/                  # Unit tests
│   ├── test_accounts.py    # 10 account tests
│   └── test_jobs.py        # 10 job tests
├── Dockerfile
├── docker-compose.yml
├── entrypoint.sh
├── requirements.txt
└── .env.example
```

### Frontend
```
Job-Portal-CareerStack-Frontend/
├── src/
│   ├── api/
│   │   └── axios.js            # Axios config + interceptors
│   ├── context/
│   │   ├── AuthContext.js      # Global auth state
│   │   └── ThemeContext.js     # Dark/Light mode state
│   ├── components/
│   │   └── Navbar.js           # Role based navigation
│   ├── pages/
│   │   ├── Home.js             # Job listings + search
│   │   ├── Login.js            # Login page
│   │   ├── Register.js         # Register with role toggle
│   │   ├── JobDetail.js        # Job detail + apply modal
│   │   ├── JobSeekerDashboard.js
│   │   └── EmployerDashboard.js
│   ├── App.js                  # Routes + protected routes
│   └── index.css               # CSS variables for themes
└── .env.example
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.13
- Node.js 18+
- Docker Desktop

### Backend Setup

```bash
# Clone the backend repo
git clone https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Backend.git
cd Job-Portal-CareerStack-Backend

# Copy environment file
cp .env.example .env
# Fill in your values in .env

# Run with Docker (recommended)
docker-compose up --build

# OR run locally
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
# Clone the frontend repo
git clone https://github.com/Dhanashree-Raut/Job-Portal-CareerStack-Frontend.git
cd Job-Portal-CareerStack-Frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=your-neon-postgresql-url
REDIS_URL=your-redis-cloud-url
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:8000
CI=false
```

---

## 📡 API Endpoints

### Accounts
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/accounts/register/` | Public | Register new user |
| POST | `/api/accounts/login/` | Public | Login and get tokens |
| POST | `/api/accounts/logout/` | Auth | Logout and blacklist token |
| GET/PUT | `/api/accounts/profile/` | Auth | View or update profile |
| POST | `/api/accounts/change-password/` | Auth | Change password |
| POST | `/api/accounts/token/refresh/` | Public | Refresh access token |

### Jobs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/jobs/` | Public | List all active jobs |
| POST | `/api/jobs/` | Employer | Create a new job |
| GET | `/api/jobs/:id/` | Public | Job detail |
| PUT | `/api/jobs/:id/` | Owner Employer | Update job |
| DELETE | `/api/jobs/:id/` | Owner Employer | Delete job |
| GET | `/api/jobs/my-jobs/` | Employer | Employer's own jobs |
| POST | `/api/jobs/:id/apply/` | Job Seeker | Apply to a job |
| GET | `/api/jobs/my-applications/` | Job Seeker | My applications |
| GET | `/api/jobs/:id/applications/` | Employer | Applications for a job |
| PUT | `/api/jobs/applications/:id/status/` | Employer | Update application status |

---

## 🧪 Running Tests

```bash
# Run locally
pytest tests/ -v

# Run in Docker
docker-compose run --rm web pytest tests/ -v

# Run specific file
pytest tests/test_accounts.py -v
pytest tests/test_jobs.py -v
```

**Test Coverage: 20/20 tests passing ✅**

---

## 🐳 Docker Commands

```bash
# Start all services (Django + Celery + Redis)
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f web

# Run tests inside Docker
docker-compose run --rm web pytest tests/ -v
```

---

## 📬 Email Notifications

Email notifications are sent automatically using **Celery + Redis** in the background:

- ✅ **Job Seeker applies** → Employer receives email notification
- ✅ **Employer updates status** → Job Seeker receives email with status and note

---

## 👩‍💻 Author

**Dhanashree Raut**
- 🐙 GitHub: [@Dhanashree-Raut](https://github.com/Dhanashree-Raut)
- 💼 Frontend: https://job-portal-career-stack-frontend.vercel.app
- ⚙️ Backend: https://job-portal-careerstack-backend-production.up.railway.app/swagger/

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).