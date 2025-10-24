const User = require('../models/user');
const { fetchNews } = require("../../services/newsService");

const getNews = async (req, res) => {
    try {
        const { id } = req.user;
        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });
        const news = await fetchNews(foundUser.preferences);
        res.status(200).json({ news });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.user;
        const { id: articleId } = req.params;

        if (!articleId) {
            return res.status(400).json({ message: 'Article ID is required' });
        }

        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        if (!foundUser.readArticles.includes(articleId)) {
            foundUser.readArticles.push(articleId);
            await foundUser.save();
        }

        res.status(200).json({ message: 'Article marked as read', articleId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const markAsFavorite = async (req, res) => {
    try {
        const { id } = req.user;
        const { id: articleId } = req.params;

        if (!articleId) {
            return res.status(400).json({ message: 'Article ID is required' });
        }

        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        if (!foundUser.favoriteArticles.includes(articleId)) {
            foundUser.favoriteArticles.push(articleId);
            await foundUser.save();
        }

        res.status(200).json({ message: 'Article marked as favorite', articleId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getReadArticles = async (req, res) => {
    try {
        const { id } = req.user;
        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ readArticles: foundUser.readArticles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFavoriteArticles = async (req, res) => {
    try {
        const { id } = req.user;
        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ favoriteArticles: foundUser.favoriteArticles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const searchNews = async (req, res) => {
    try {
        const { query } = req.params;
        const news = await fetchNews([query]);
        res.status(200).json({ news });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles, searchNews };
