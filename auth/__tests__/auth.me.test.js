const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

const jestTestSetup = require("../test/setup");

jestTestSetup();

test("GET /api/auth/me returns 200 and user info when authenticated", async () => {
  const payload = {
    username: "meuser",
    email: "me@example.com",
    password: "password123",
    fullName: { firstName: "Me", lastName: "User" },
  };

  // register then login to obtain auth cookie
  await request(app).post("/api/auth/register").send(payload);
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: payload.email, password: payload.password });

  const cookie = loginRes.headers["set-cookie"];
  const res = await request(app).get("/api/auth/me").set("Cookie", cookie);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("user");
  expect(res.body.user.email).toBe(payload.email);
});

test("GET /api/auth/me returns 401 when not authenticated", async () => {
  const res = await request(app).get("/api/auth/me");
  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty("message");
});

test("GET /api/auth/me returns 401 when token not provided", async () => {
  const fakeToken = jwt.sign({ id: "000000000000000" }, "wrong_secret");
  const res = await request(app)
    .get("/api/auth/me")
    .set("Cookie", [`token=${fakeToken}`]);
  expect(res.status).toBe(401);
});
