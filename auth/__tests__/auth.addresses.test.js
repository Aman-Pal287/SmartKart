jest.setTimeout(30000);

const request = require("supertest");
const app = require("../src/app");
const jestTestSetup = require("../test/setup");
const User = require("../src/model/user.model");

jestTestSetup();

const addressPayload = {
  street: "123 Main St",
  city: "Delhi",
  state: "Delhi",
  pincode: "110001",
  country: "India",
  isDefault: true,
};

async function registerAndLogin() {
  const payload = {
    username: "addressuser",
    email: "address@example.com",
    password: "password123",
    fullName: { firstName: "Address", lastName: "User" },
  };
  await request(app).post("/api/auth/register").send(payload);
  return request(app)
    .post("/api/auth/login")
    .send({ email: payload.email, password: payload.password });
}

test("GET /api/auth/me/addresses returns list of addresses and marks default", async () => {
  const loginRes = await registerAndLogin();
  const cookie = loginRes.headers["set-cookie"];

  // Add two addresses
  await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send({ ...addressPayload, isDefault: true });
  await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send({ ...addressPayload, street: "456 Side St", isDefault: false });

  const res = await request(app)
    .get("/api/auth/me/addresses")
    .set("Cookie", cookie);

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.addresses)).toBe(true);
  const defaultAddr = res.body.addresses.find((a) => a.isDefault);
  expect(defaultAddr).toBeDefined();
});

test("POST /api/auth/me/addresses adds address with valid pincode and phone", async () => {
  const loginRes = await registerAndLogin();
  const cookie = loginRes.headers["set-cookie"];

  const res = await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send(addressPayload);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("address");
  expect(res.body.address.pincode).toBe(addressPayload.pincode);
});

test("POST /api/auth/me/addresses fails with invalid pincode or phone", async () => {
  const loginRes = await registerAndLogin();
  const cookie = loginRes.headers["set-cookie"];

  // Invalid pincode
  let res = await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send({ ...addressPayload, zip: "abcde" });
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("errors");

  // Invalid phone
  res = await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send({ ...addressPayload, phone: "123" });
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("errors");
});

test("DELETE /api/auth/me/addresses/:addressId removes address", async () => {
  const loginRes = await registerAndLogin();
  const cookie = loginRes.headers["set-cookie"];

  // Add address
  const addRes = await request(app)
    .post("/api/auth/me/addresses")
    .set("Cookie", cookie)
    .send(addressPayload);
  const addressId = addRes.body.address._id;

  // Delete address
  const delRes = await request(app)
    .delete(`/api/auth/me/addresses/${addressId}`)
    .set("Cookie", cookie);
  expect(delRes.status).toBe(200);
  expect(delRes.body).toHaveProperty("message");
});
