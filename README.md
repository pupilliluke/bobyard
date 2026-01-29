# Comments Application

A full-stack comment system built with Django REST Framework and React.

## Features

- View all comments with author, text, date, likes, and images
- Add new comments (as Admin user)
- Edit existing comments
- Delete comments
- Clean, responsive design

## Tech Stack

**Backend:**
- Django 4.2
- Django REST Framework
- PostgreSQL (production) / SQLite (development)
- Gunicorn
- WhiteNoise for static files

**Frontend:**
- React 18
- Vite
- CSS (no framework, custom styling)

## Local Development Setup

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed the database with sample comments:
   ```bash
   python manage.py seed_comments
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/` | List all comments |
| POST | `/api/comments/` | Create a new comment |
| GET | `/api/comments/{id}/` | Get a single comment |
| PUT | `/api/comments/{id}/` | Update a comment |
| PATCH | `/api/comments/{id}/` | Partially update a comment |
| DELETE | `/api/comments/{id}/` | Delete a comment |

### Create Comment Request Body
```json
{
  "text": "Your comment text here"
}
```
Note: `author` defaults to "Admin" and `date` defaults to current time.

## Railway Deployment

### Backend Deployment

1. Create a new project on Railway
2. Add a PostgreSQL database service
3. Create a new service from the `backend` directory
4. Set environment variables:
   - `SECRET_KEY`: Generate a secure secret key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: Your Railway domain (e.g., `your-app.railway.app`)
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL

5. Railway will automatically detect the `Procfile` and deploy

### Frontend Deployment

1. Create a new service from the `frontend` directory
2. Set the build command: `npm run build`
3. Set the start command: `npm run preview` (or use a static hosting service)
4. Set environment variable:
   - `VITE_API_URL`: Your backend Railway URL (e.g., `https://your-backend.railway.app/api`)

### Quick Deploy Commands

After initial Railway setup, deploy with:
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
railway up
```

## Project Structure

```
.
├── backend/
│   ├── config/           # Django project settings
│   ├── comments/         # Comments app
│   │   ├── models.py     # Comment model
│   │   ├── serializers.py
│   │   ├── views.py      # API views
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api.js        # API client
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
