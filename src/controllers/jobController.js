const newsUpdateJob = require('../../services/newsUpdateJob');

const getJobStatus = async (req, res) => {
    try {
        const status = newsUpdateJob.getStatus();
        res.status(200).json(status);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const triggerManualUpdate = async (req, res) => {
    try {
        console.log('[JobController] Manual cache update triggered');
        const result = await newsUpdateJob.updateNewsCache();
        res.status(200).json({
            message: 'Manual update completed',
            result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getJobStatus, triggerManualUpdate };
