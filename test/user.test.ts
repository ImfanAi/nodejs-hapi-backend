import request from "supertest";
import createServer from "../index";

describe("Post /", () => {
  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("should return status code 201", async () => {
    const userData = {
      firstName: "Lilo",
      lastName: "Lange",
      email: "sage15578@gmail.com",
      phoneNumber: "4532623152",
      password: "codemaster",
      role: "investor",
      referralCode: "123",
    };

    const response = await request((await server).listener)
      .post("/api/v1/user/register")
      .send(userData);

    expect(response.statusCode).toEqual(201);
  }, 10000);

  it("should return status code 201", async () => {
    const userData = {
      email: "sage15578@gmail.com",
      password: "codemaster",
    };

    const response = await request((await server).listener)
      .post("/api/v1/user/login")
      .send(userData);

    expect(response.statusCode).toEqual(200);
  }, 10000);
});
