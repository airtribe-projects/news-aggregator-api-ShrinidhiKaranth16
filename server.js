const connectDB = require('./config/db');
const app = require('./app');
const newsUpdateJob = require('./services/newsUpdateJob');

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server listening on ${port}`);
      
      newsUpdateJob.start();
      console.log('Real-time news aggregator background job started');
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      newsUpdateJob.stop();
      server.close(() => {
        console.log('HTTP server closed');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      newsUpdateJob.stop();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
