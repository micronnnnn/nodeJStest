// config/redis.js
const Redis = require('ioredis');

// 使用預設 port 6379 和本機 Redis
const redis = new Redis({
  host: '127.0.0.1', // 或你的 Redis 主機位置
  port: 6379,
  password: '',      // 如果有密碼可以填上
  db: 3              // 使用第幾個 Redis 資料庫（預設為 0）
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = redis;
