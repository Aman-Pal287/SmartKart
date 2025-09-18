const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../src/model/user.model");

function jestTestSetup() {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // process.env.MONGO_URL = uri;
    process.env.JWT_SECRET = "test_jwt_secret";
    process.env.NODE_ENV = "test"; // Test environment set karo

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();

    // Redis connection close karo agar exists toh
    const redis = require("../src/db/redis");
    if (redis.quit) {
      await redis.quit();
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });
}

module.exports = jestTestSetup;
