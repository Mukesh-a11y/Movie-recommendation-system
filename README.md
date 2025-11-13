#  CineAI — AI-Powered Movie Recommendation Platform

CineAI is a full-stack AI-driven movie recommendation app that combines a **Flask + SQLite** backend with a **React** frontend.  
It leverages **Groq’s Llama 3.3 70B** (or any LLM API) to generate intelligent, personalized movie suggestions based on user preferences.

---

##  Features

- **AI-Powered Movie Recommendations** using Groq AI (Llama 3.3 70B)
-  **User Session Management** with SQLite database
-  **React Frontend** with real-time analytics
-  **RESTful Flask API** returning JSON responses
-  **Interactive UI** with genre and year filters

---

##  Tech Stack

**Frontend**
- React  
- Lucide React Icons  
- Inline CSS + Animations  

**Backend**
- Flask  
- Flask-CORS  
- SQLAlchemy  
- Groq API (Llama 3.3 70B)  
- SQLite  

---

## ⚙️ Installation

### 1️ Clone Repository
```bash
git clone https://github.com/yourusername/cineai.git
cd cineai
```

### 2️ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python main.py
```

Backend runs on:  
 http://localhost:5000

### 3️ Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on:  
 http://localhost:3000

---

##  Environment Setup

Edit the **Groq API Key** in `main.py`:
```python
GROQ_API_KEY = "your_groq_api_key_here"
```

>  Tip: Use environment variables for secure production setup.

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/` | API information |
| GET | `/api/health` | Check server and AI configuration |
| POST | `/api/recommend` | Generate AI-powered recommendations |
| GET | `/api/history/<session_id>` | Retrieve user recommendation history |
| GET | `/api/statistics` | App statistics overview |
| DELETE | `/api/clear-history/<session_id>` | Clear user recommendation history |

---

##  Database Schema

**User**
- `id`, `session_id`, `created_at`, `last_active`

**Recommendation**
- `id`, `user_id`, `query`, `created_at`

**Movie**
- `id`, `recommendation_id`, `title`, `year`, `genre`, `description`, `rating`

---

##  Analytics Dashboard

The frontend analytics includes:
-  Average rating  
-  Total movies recommended  
-  Highest-rated movie  
-  Genre and year distributions  

---

##  Development Notes

- Backend initialized via `init_db()` on startup  
- Requires valid **Groq API key**  
- Run Flask in `debug=True` for development  
- Fully CORS-enabled for frontend communication  

---

##  License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
