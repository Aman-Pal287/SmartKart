const request = require("supertest");
const app = require("../src/app");

const jestTestSetup = require("../test/setup");

jestTestSetup();

//! LOGIN USER TEST

test("POST /api/auth/login authenticates existing user and returns 200", async () => {
  const payload = {
    username: "loginuser",
    email: "login@example.com",
    password: "password123",
    fullName: { firstName: "Login", lastName: "User" },
  };

  // register the user first
  await request(app).post("/api/auth/register").send(payload);

  const res = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("message", "Login successful");
  expect(res.body).toHaveProperty("user");
});

test("POST /api/auth/login returns 401 for invalid credentials", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "noone@example.com", password: "badpass" });

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty("message", "Invalid credentials");
});


