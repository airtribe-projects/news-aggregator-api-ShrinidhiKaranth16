const axios = require('axios');
const { getCache, setCache } = require('./cacheService');

const fetchNews = async (preferences) => {
    try {
        const cacheKey = preferences.join("-");
        const cachedData = getCache(cacheKey);
        if (cachedData) return cachedData;

        const apiKey = process.env.NEWS_API_KEY;
        const query = preferences.join(" ");
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
        console.log(url)
        const response = await axios.get(url);
        setCache(cacheKey, response.data.articles);
        return response.data.articles; 
    } catch (err) {
        console.error("Error fetching news:", err.message);
        return [];
    }
};

module.exports = { fetchNews };
