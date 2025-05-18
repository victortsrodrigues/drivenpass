import supertest from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";
import prisma from "../../src/database/database";
import Cryptr from "cryptr";
import { createUser, generateToken, generateCredential, createCredential } from "../factories/factory";

export const cryptr = new Cryptr("myTotallySecretKey");
const server = supertest(app);

beforeEach(async () => {
  await prisma.credential.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("POST /credentials", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.post("/credentials");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .post("/credentials")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 422 when body is invalid", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when title is missing", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const credential = generateCredential();
    delete credential.title;

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when url is missing", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const credential = generateCredential();
    delete credential.url;

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when username is missing", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const credential = generateCredential();
    delete credential.username;

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when password is missing", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const credential = generateCredential();
    delete credential.password;

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 409 when title already exists for the same user", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential = generateCredential();

    await createCredential(credential, user.id);

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it("should return 201 when credential is created successfully", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential = generateCredential();

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.CREATED);

    const createdCredential = await prisma.credential.findFirst({
      where: {
        title: credential.title,
        user_id: user.id,
      },
    });

    expect(createdCredential).not.toBeNull();
    expect(createdCredential.title).toBe(credential.title);
    expect(createdCredential.url).toBe(credential.url);
    expect(createdCredential.username).toBe(credential.username);
    expect(cryptr.decrypt(createdCredential.password)).toBe(credential.password);
  });

  it("should allow different users to create credentials with the same title", async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const token1 = generateToken(user1.id);
    const token2 = generateToken(user2.id);
    const credential = generateCredential();

    await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token1}`)
      .send(credential);

    const response = await server
      .post("/credentials")
      .set("Authorization", `Bearer ${token2}`)
      .send(credential);

    expect(response.status).toBe(httpStatus.CREATED);
  });
});

describe("GET /credentials", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.get("/credentials");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .get("/credentials")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return empty array when user has no credentials", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .get("/credentials")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it("should return all user credentials with decrypted passwords", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential1 = generateCredential();
    const credential2 = generateCredential();

    await createCredential(credential1, user.id);
    await createCredential(credential2, user.id);

    const response = await server
      .get("/credentials")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].password).toBe(credential1.password);
    expect(response.body[1].password).toBe(credential2.password);
  });

  it("should not return credentials from other users", async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const token1 = generateToken(user1.id);
    const credential1 = generateCredential();
    const credential2 = generateCredential();

    await createCredential(credential1, user1.id);
    await createCredential(credential2, user2.id);

    const response = await server
      .get("/credentials")
      .set("Authorization", `Bearer ${token1}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe(credential1.title);
  });
});

describe("GET /credentials/:id", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.get("/credentials/1");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .get("/credentials/1")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 400 when id is not a number", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .get("/credentials/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 400 when id is not positive", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .get("/credentials/0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 404 when credential does not exist", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .get("/credentials/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 404 when credential belongs to another user", async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const token1 = generateToken(user1.id);
    const credential = generateCredential();

    const createdCredential = await createCredential(credential, user2.id);

    const response = await server
      .get(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token1}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return credential with decrypted password when found", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential = generateCredential();

    const createdCredential = await createCredential(credential, user.id);

    const response = await server
      .get(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.id).toBe(createdCredential.id);
    expect(response.body.title).toBe(credential.title);
    expect(response.body.url).toBe(credential.url);
    expect(response.body.username).toBe(credential.username);
    expect(response.body.password).toBe(credential.password);
  });
});

describe("PUT /credentials/:id", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.put("/credentials/1");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .put("/credentials/1")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 400 when id is not a number", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .put("/credentials/abc")
      .set("Authorization", `Bearer ${token}`)
      .send(generateCredential());

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 400 when id is not positive", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .put("/credentials/0")
      .set("Authorization", `Bearer ${token}`)
      .send(generateCredential());

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 422 when body is invalid", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .put("/credentials/1")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 404 when credential does not exist", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .put("/credentials/999")
      .set("Authorization", `Bearer ${token}`)
      .send(generateCredential());

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 404 when credential belongs to another user", async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const token1 = generateToken(user1.id);
    const credential = generateCredential();

    const createdCredential = await createCredential(credential, user2.id);

    const response = await server
      .put(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token1}`)
      .send(generateCredential());

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should update credential successfully", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential = generateCredential();
    const updatedCredential = generateCredential();

    const createdCredential = await createCredential(credential, user.id);

    const response = await server
      .put(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedCredential);

    expect(response.status).toBe(httpStatus.NO_CONTENT);

    const dbCredential = await prisma.credential.findUnique({
      where: { id: createdCredential.id },
    });

    expect(dbCredential.title).toBe(updatedCredential.title);
    expect(dbCredential.url).toBe(updatedCredential.url);
    expect(dbCredential.username).toBe(updatedCredential.username);
    expect(cryptr.decrypt(dbCredential.password)).toBe(updatedCredential.password);
  });
});

describe("DELETE /credentials/:id", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await server.delete("/credentials/1");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 401 when invalid token is provided", async () => {
    const response = await server
      .delete("/credentials/1")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 400 when id is not a number", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .delete("/credentials/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 400 when id is not positive", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .delete("/credentials/0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return 404 when credential does not exist", async () => {
    const user = await createUser();
    const token = generateToken(user.id);

    const response = await server
      .delete("/credentials/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 404 when credential belongs to another user", async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const token1 = generateToken(user1.id);
    const credential = generateCredential();

    const createdCredential = await createCredential(credential, user2.id);

    const response = await server
      .delete(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token1}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should delete credential successfully", async () => {
    const user = await createUser();
    const token = generateToken(user.id);
    const credential = generateCredential();

    const createdCredential = await createCredential(credential, user.id);

    const response = await server
      .delete(`/credentials/${createdCredential.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NO_CONTENT);

    const dbCredential = await prisma.credential.findUnique({
      where: { id: createdCredential.id },
    });

    expect(dbCredential).toBeNull();
  });
});
