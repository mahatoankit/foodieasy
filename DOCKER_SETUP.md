# Docker Setup Guide for FoodieEasy

## 🐳 Docker Configuration

This project is fully dockerized and can run on any machine with Docker installed (Windows, macOS, Linux).

## 📋 Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- Ports 3000, 8000, and 5432 available

## 🚀 Quick Start

### 1. Start the entire application

```bash
docker-compose up --build
```

This will:
- Build all Docker images
- Start PostgreSQL database
- Start Django backend (with automatic migrations)
- Start React frontend

### 2. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

### 3. Stop the application

```bash
# Stop containers (keep data)
docker-compose down

# Stop containers and remove volumes (delete all data)
docker-compose down -v
```

## 🛠️ Common Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Execute commands in containers
```bash
# Django management commands
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py shell

# Access PostgreSQL
docker-compose exec db psql -U foodieasy_user -d foodieasy

# Access backend shell
docker-compose exec backend bash

# Access frontend shell
docker-compose exec frontend sh
```

### Rebuild specific service
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Clean up Docker resources
```bash
# Remove stopped containers
docker-compose rm

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune
```

## 🔧 Development Workflow

### Making code changes

**Backend changes**: 
- Edit files in `backend/` directory
- Django auto-reloads on file changes
- If you add new dependencies, rebuild: `docker-compose up --build backend`

**Frontend changes**:
- Edit files in `frontend/` directory  
- React auto-reloads on file changes
- If you add new npm packages, rebuild: `docker-compose up --build frontend`

### Database Management

**Create superuser**:
```bash
docker-compose exec backend python manage.py createsuperuser
```

**Apply migrations**:
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

**Populate test data**:
```bash
docker-compose exec backend python populate_nepal_data.py
```

**Reset database** (WARNING: deletes all data):
```bash
docker-compose down -v
docker-compose up --build
```

## 🌐 Network Configuration

All services run in a shared Docker network (`foodieasy-network`):
- Services can communicate using their service names (e.g., `backend`, `db`, `frontend`)
- Ports are exposed to your host machine for access

## 📦 Volumes

- `postgres_data`: Persistent PostgreSQL database storage
- `./backend:/app`: Backend code is mounted for live reload
- `./frontend:/app`: Frontend code is mounted for live reload
- `/app/node_modules`: Node modules are stored in a separate volume

## 🔍 Troubleshooting

### Port already in use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Database connection issues
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend not loading
```bash
# Check logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend

# Clear node_modules and rebuild
docker-compose down
docker volume rm foodieasy_node_modules
docker-compose up --build
```

### Backend errors
```bash
# Check logs
docker-compose logs backend

# Run migrations manually
docker-compose exec backend python manage.py migrate

# Rebuild backend
docker-compose up --build backend
```

### Out of disk space
```bash
# Clean up Docker
docker system prune -a --volumes
```

## 🚀 Production Deployment

For production, you should:
1. Create a `docker-compose.prod.yml` with production settings
2. Use environment-specific `.env` files
3. Set `DEBUG=False` in Django
4. Use a production WSGI server (gunicorn)
5. Use nginx as a reverse proxy
6. Use managed database service instead of Docker PostgreSQL
7. Enable HTTPS/SSL certificates

## 📝 Notes

- The project uses **PostgreSQL 15** in Docker (not Neon database)
- All environment variables are set in `docker-compose.yml`
- Stack Auth credentials are preserved from your original setup
- The setup includes hot-reloading for both frontend and backend

## ✅ Verification

After starting with `docker-compose up`, you should see:
- ✅ PostgreSQL started and healthy
- ✅ Django migrations applied successfully  
- ✅ Backend running on port 8000
- ✅ Frontend compiled and running on port 3000
