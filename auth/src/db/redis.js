// Test environment check - agar test mode hai toh simple object return karo
if (process.env.NODE_ENV === "test") {
  // Test environment ke liye mock redis
  const mockRedis = {
    set: () => Promise.resolve("OK"),
    get: () => Promise.resolve(null),
    del: () => Promise.resolve(1),
    quit: () => Promise.resolve("OK"),
    flushall: () => Promise.resolve("OK"),
    on: (event, callback) => {
      if (event === "connect") {
        setTimeout(callback, 10);
      }
      return mockRedis;
    },
  };

  module.exports = mockRedis;
} else {
  // Production/development environment
  const { Redis } = require("ioredis");

  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully");
  });

  module.exports = redis;
}
