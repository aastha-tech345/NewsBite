const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on('error', (err) => {
      console.warn('Redis error (non-fatal):', err.message);
    });

    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.warn('Redis unavailable, continuing without cache:', err.message);
    redisClient = null;
  }
};

const getRedis = () => redisClient;

module.exports = { connectRedis, getRedis };
