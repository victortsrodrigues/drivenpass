import supertest from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";
import prisma from "../../src/database/database";
import bcrypt from "bcrypt";
import { createUser, generateToken, generateCredential, createCredential } from "../factories/factory";

const server = supertest(app);

beforeEach(async () => {
  await prisma.credential.deleteMany({});
});

describe("DELETE /erase", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.delete("/erase");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .delete("/erase")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should delete user and all their credentials", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const credential1 = generateCredential();
    const credential2 = generateCredential();
    await createCredential(credential1, user.id);
    await createCredential(credential2, user.id);

    const credentialsBefore = await prisma.credential.findMany({
      where: { user_id: user.id },
    });
    expect(credentialsBefore.length).toBe(2);

    const response = await server
      .delete("/erase")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NO_CONTENT);

    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();

    const credentialsAfter = await prisma.credential.findMany({
      where: { user_id: user.id },
    });
    expect(credentialsAfter.length).toBe(0);
  });
});

describe("Seed User", () => {
  it("should have created the demo user", async () => {
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@driven.com.br" },
    });

    expect(demoUser).not.toBeNull();
    expect(demoUser.name).toBe("Demo");
    expect(demoUser.email).toBe("demo@driven.com.br");

    const passwordMatch = await bcrypt.compare("demo123", demoUser.password);
    expect(passwordMatch).toBe(true);
  });

  it("should be able to login with demo user credentials", async () => {
    const credentials = {
      email: "demo@driven.com.br",
      password: "demo123",
    };

    const response = await server.post("/sign-in").send(credentials);
    
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveProperty("token");
  });

  it("should be able to create and retrieve credentials for demo user", async () => {
    const loginResponse = await server.post("/sign-in").send({
      email: "demo@driven.com.br",
      password: "demo123",
    });
    
    const token = loginResponse.body.token;
    
    const credential = generateCredential();
    
    const createResponse = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);
      
    expect(createResponse.status).toBe(httpStatus.CREATED);
    
    const getResponse = await server
      .get("/credentials")
      .set("Authorization", `Bearer ${token}`);
      
    expect(getResponse.status).toBe(httpStatus.OK);
    expect(getResponse.body.length).toBeGreaterThan(0);
    
    const createdCredential = getResponse.body.find(
      (c) => c.title === credential.title
    );
    
    expect(createdCredential).toBeDefined();
    expect(createdCredential.url).toBe(credential.url);
    expect(createdCredential.username).toBe(credential.username);
    expect(createdCredential.password).toBe(credential.password);
  });
});