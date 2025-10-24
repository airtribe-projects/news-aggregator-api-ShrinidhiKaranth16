const User = require('../src/models/user');
const { fetchNews } = require('./newsService');
const { getAllCacheKeys, getCacheStats } = require('./cacheService');

class NewsUpdateJob {
    constructor(intervalMinutes = 5) {
        this.intervalMinutes = intervalMinutes;
        this.intervalMs = intervalMinutes * 60 * 1000;
        this.isRunning = false;
        this.jobInterval = null;
        this.lastRunTime = null;
        this.updateCount = 0;
    }

    async updateNewsCache() {
        try {
            console.log(`[NewsUpdateJob] Starting cache update at ${new Date().toISOString()}`);
            
            const users = await User.find({}).select('preferences');
            const uniquePreferences = new Set();
            
            users.forEach(user => {
                if (user.preferences && user.preferences.length > 0) {
                    const prefKey = user.preferences.join('-');
                    uniquePreferences.add(JSON.stringify(user.preferences));
                }
            });

            console.log(`[NewsUpdateJob] Found ${uniquePreferences.size} unique preference combinations`);

            let updatedCount = 0;
            for (const prefString of uniquePreferences) {
                const preferences = JSON.parse(prefString);
                try {
                    await fetchNews(preferences);
                    updatedCount++;
                    console.log(`[NewsUpdateJob] Updated cache for preferences: ${preferences.join(', ')}`);
                } catch (error) {
                    console.error(`[NewsUpdateJob] Error updating cache for ${preferences.join(', ')}:`, error.message);
                }
            }

            this.lastRunTime = new Date();
            this.updateCount++;
            
            const stats = getCacheStats();
            console.log(`[NewsUpdateJob] Cache update completed. Updated ${updatedCount}/${uniquePreferences.size} caches. Total cached items: ${stats.totalKeys}`);
            
            return {
                success: true,
                updatedCount,
                totalPreferences: uniquePreferences.size,
                cacheStats: stats
            };
        } catch (error) {
            console.error('[NewsUpdateJob] Error in updateNewsCache:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    start() {
        if (this.isRunning) {
            console.log('[NewsUpdateJob] Job is already running');
            return;
        }

        console.log(`[NewsUpdateJob] Starting background job with ${this.intervalMinutes} minute interval`);
        this.isRunning = true;

        this.updateNewsCache();

        this.jobInterval = setInterval(() => {
            this.updateNewsCache();
        }, this.intervalMs);

        console.log('[NewsUpdateJob] Background job started successfully');
    }

    stop() {
        if (!this.isRunning) {
            console.log('[NewsUpdateJob] Job is not running');
            return;
        }

        if (this.jobInterval) {
            clearInterval(this.jobInterval);
            this.jobInterval = null;
        }

        this.isRunning = false;
        console.log('[NewsUpdateJob] Background job stopped');
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            intervalMinutes: this.intervalMinutes,
            lastRunTime: this.lastRunTime,
            updateCount: this.updateCount,
            cacheStats: getCacheStats()
        };
    }
}

const newsUpdateJob = new NewsUpdateJob(5);

module.exports = newsUpdateJob;
