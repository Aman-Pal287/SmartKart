const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user.model");
const jestTestSetup = require("../test/setup");

jestTestSetup();

//! REGISTER USER TEST
test("POST /api/auth/register creates a user and returns 201", async () => {
  const payload = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    fullName: { firstName: "Test", lastName: "User" },
  };

  const res = await request(app).post("/api/auth/register").send(payload);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("user");
  expect(res.body.user.user.email).toBe(payload.email);

  const user = await User.findOne({ email: payload.email }).lean();

  expect(user).not.toBeNull();
  expect(user.username).toBe(payload.username);
  expect(user.password).not.toBe(payload.password);
});

test("POST /api/auth/register returns 409 for duplicate user", async () => {
  const payload = {
    username: "dupuser",
    email: "dup@example.com",
    password: "password123",
    fullName: { firstName: "Dup", lastName: "User" },
  };

  await request(app).post("/api/auth/register").send(payload);
  const res = await request(app).post("/api/auth/register").send(payload);
  expect(res.status).toBe(409);
});

test("POST /api/auth/register returns 400 for missing required fields", async () => {
  const incomplete = {
    username: "incomplete",
    // email missing
    password: "password123",
    // fullName missing
  };

  const res = await request(app).post("/api/auth/register").send(incomplete);
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("errors");
  expect(Array.isArray(res.body.errors)).toBe(true);
  const emailError = res.body.errors.find((e) => e.path === "email");
  expect(emailError).toBeDefined();
});

