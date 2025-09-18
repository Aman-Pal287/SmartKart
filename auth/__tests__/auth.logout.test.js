jest.setTimeout(30000); // 30 seconds timeout

const request = require("supertest");
const app = require("../src/app");
const jestTestSetup = require("../test/setup");

jestTestSetup();

test("GET /api/auth/logout logs out authenticated user and clears cookie", async () => {
  const payload = {
    username: "logoutuser",
    email: "logout@example.com",
    password: "password123",
    fullName: { firstName: "Logout", lastName: "User" },
  };

  // Register and login to get cookie
  await request(app).post("/api/auth/register").send(payload);
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: payload.email, password: payload.password });

  const cookie = loginRes.headers["set-cookie"];
  const res = await request(app).get("/api/auth/logout").set("Cookie", cookie);

  expect(res.status).toBe(200);
  // Check that the cookie is cleared (set-cookie header with expired token)
  expect(res.headers["set-cookie"]).toBeDefined();
  // Optionally check response message
  expect(res.body).toHaveProperty("message");
  
});

test("GET /api/auth/logout returns 200 even if not authenticated", async () => {
  const res = await request(app).get("/api/auth/logout");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("message");
});