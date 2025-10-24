const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');

const { signup, login } = require('./src/controllers/authController');
const { getPreferences, updatePreferences } = require('./src/controllers/preferenceController');
const requireAuth = require('./middlewears/requireAuth');
const { getNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles, searchNews } = require('./src/controllers/newsController');
const { getJobStatus, triggerManualUpdate } = require('./src/controllers/jobController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/users/signup', signup);
app.post('/users/login', login);

app.use(requireAuth);

app.get("/users/preferences", getPreferences);
app.put("/users/preferences", updatePreferences);
app.get("/news", getNews);
app.post("/news/:id/read", markAsRead);
app.post("/news/:id/favorite", markAsFavorite);
app.get("/news/read", getReadArticles);
app.get("/news/favorites", getFavoriteArticles);
app.get("/news/search/:query", searchNews);
app.get("/job/status", getJobStatus);
app.post("/job/update", triggerManualUpdate);

module.exports = app;  
