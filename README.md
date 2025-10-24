# News Aggregator API

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21257322&assignment_repo_type=AssignmentRepo)

A RESTful API for aggregating news articles based on user preferences with real-time background updates, caching, and user authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)

## ✨ Features

- **User Authentication**: Secure signup and login with JWT tokens and bcrypt password hashing
- **News Preferences**: Users can set and update their news preferences
- **News Aggregation**: Fetch news articles based on user preferences from NewsAPI
- **Article Tracking**: Mark articles as read or favorite
- **Search Functionality**: Search for news articles by keyword
- **Smart Caching**: In-memory caching with TTL (Time To Live) for improved performance
- **Real-time Updates**: Background job that periodically refreshes cached news articles every 5 minutes
- **Input Validation**: Email format, password length, and preferences validation
- **Job Monitoring**: Endpoints to check background job status and manually trigger updates

## 🛠 Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **External API**: NewsAPI
- **Testing**: Tap & Supertest
- **Dev Tools**: Nodemon

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **NewsAPI Key** (get one from [https://newsapi.org/](https://newsapi.org/))

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-aggregator-api-ShrinidhiKaranth16
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/news-aggregator
   JWT_SECRET=your_jwt_secret_key_here
   NEWS_API_KEY=your_newsapi_key_here
   ```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | Yes |
| `NEWS_API_KEY` | API key from NewsAPI.org | Yes |

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
node server.js
```

### Running Tests
```bash
npm test
```

The server will start on `http://localhost:3000` (or your specified PORT).

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All endpoints except `/users/signup` and `/users/login` require authentication via JWT token in cookies.

---

### 🔑 Authentication Endpoints

#### 1. User Signup
**POST** `/users/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": ["technology", "sports"]
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `preferences`: Optional, array of non-empty strings

**Response (200):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400`: Invalid email format / Password too short / Invalid preferences
- `400`: User already exists

---

#### 2. User Login
**POST** `/users/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: All fields are required
- `401`: Invalid credentials

---

### 👤 User Preferences Endpoints

#### 3. Get User Preferences
**GET** `/users/preferences`

Retrieve current user's news preferences.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "preferences": ["technology", "sports", "business"]
}
```

---

#### 4. Update User Preferences
**PUT** `/users/preferences`

Update user's news preferences.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Request Body:**
```json
{
  "preferences": ["technology", "health", "science"]
}
```

**Validation Rules:**
- `preferences`: Required, must be an array of non-empty strings

**Response (200):**
```json
{
  "preferences": ["technology", "health", "science"]
}
```

**Error Responses:**
- `400`: Preferences are required / Preferences must be an array / Each preference must be a non-empty string

---

### 📰 News Endpoints

#### 5. Get News
**GET** `/news`

Fetch news articles based on user's preferences.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "news": [
    {
      "source": { "id": null, "name": "TechCrunch" },
      "author": "Jane Smith",
      "title": "Latest Tech Innovations",
      "description": "Exploring new technologies...",
      "url": "https://example.com/article",
      "urlToImage": "https://example.com/image.jpg",
      "publishedAt": "2025-10-24T10:00:00Z",
      "content": "Full article content..."
    }
  ]
}
```

---

#### 6. Search News
**GET** `/news/search/:query`

Search for news articles by keyword.

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `query`: Search keyword (e.g., "artificial intelligence")

**Example:**
```
GET /news/search/artificial%20intelligence
```

**Response (200):**
```json
{
  "news": [
    {
      "source": { "id": null, "name": "AI Weekly" },
      "title": "AI Breakthrough in 2025",
      "description": "New developments in AI...",
      "url": "https://example.com/ai-article",
      "publishedAt": "2025-10-24T12:00:00Z"
    }
  ]
}
```

---

#### 7. Mark Article as Read
**POST** `/news/:id/read`

Mark a specific news article as read.

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id`: Article identifier

**Response (200):**
```json
{
  "message": "Article marked as read",
  "articleId": "article-123"
}
```

**Error Responses:**
- `400`: Article ID is required

---

#### 8. Mark Article as Favorite
**POST** `/news/:id/favorite`

Mark a specific news article as favorite.

**Headers:**
```
Cookie: token=<jwt_token>
```

**URL Parameters:**
- `id`: Article identifier

**Response (200):**
```json
{
  "message": "Article marked as favorite",
  "articleId": "article-123"
}
```

**Error Responses:**
- `400`: Article ID is required

---

#### 9. Get Read Articles
**GET** `/news/read`

Retrieve all articles marked as read by the user.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "readArticles": ["article-123", "article-456", "article-789"]
}
```

---

#### 10. Get Favorite Articles
**GET** `/news/favorites`

Retrieve all articles marked as favorite by the user.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "favoriteArticles": ["article-123", "article-789"]
}
```

---

### 🔧 Background Job Endpoints

#### 11. Get Job Status
**GET** `/job/status`

Check the status of the background news update job.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "isRunning": true,
  "intervalMinutes": 5,
  "lastRunTime": "2025-10-24T10:25:00.000Z",
  "updateCount": 12,
  "cacheStats": {
    "totalKeys": 3,
    "keys": [
      {
        "key": "technology-sports",
        "expiry": "2025-10-24T10:30:00.000Z",
        "itemCount": 20
      }
    ]
  }
}
```

---

#### 12. Trigger Manual Update
**POST** `/job/update`

Manually trigger a cache update for all user preferences.

**Headers:**
```
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "message": "Manual update completed",
  "result": {
    "success": true,
    "updatedCount": 3,
    "totalPreferences": 3,
    "cacheStats": {
      "totalKeys": 3,
      "keys": [...]
    }
  }
}
```

---

## 📁 Project Structure

```
news-aggregator-api/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── middlewears/
│   └── requireAuth.js           # JWT authentication middleware
├── services/
│   ├── cacheService.js          # In-memory caching service
│   ├── newsService.js           # NewsAPI integration
│   └── newsUpdateJob.js         # Background job for cache updates
├── src/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── jobController.js     # Background job monitoring
│   │   ├── newsController.js    # News operations
│   │   └── preferenceController.js # User preferences
│   ├── models/
│   │   └── user.js              # User schema
│   └── utils/
│       └── validation.js        # Input validation utilities
├── test/
│   └── server.test.js           # API tests
├── .env                         # Environment variables (not in repo)
├── .gitignore
├── app.js                       # Express app configuration
├── package.json
├── README.md
└── server.js                    # Server entry point
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The project uses **Tap** for testing with **Supertest** for HTTP assertions.

## 🔄 Background Job System

The application includes an automated background job that:

- **Runs every 5 minutes** to refresh cached news articles
- **Fetches unique preference combinations** from all users
- **Updates cache** with fresh news from NewsAPI
- **Logs activity** for monitoring and debugging
- **Gracefully shuts down** when the server stops

### Cache Configuration

- **Default TTL**: 300 seconds (5 minutes)
- **Storage**: In-memory (resets on server restart)
- **Smart Updates**: Only fetches news for unique preference combinations

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Email format, password strength, data types
- **Cookie-based Tokens**: HttpOnly cookies for token storage

## 📝 Notes

- The cache is stored in-memory and will be cleared on server restart
- Background job starts automatically when the server starts
- NewsAPI has rate limits - monitor your usage
- All timestamps are in ISO 8601 format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Shrinidhi Karanth

---

**Happy Coding! 🚀**
