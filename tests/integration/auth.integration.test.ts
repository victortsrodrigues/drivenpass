import supertest from "supertest";
import httpStatus from "http-status";
import { faker } from "@faker-js/faker";
import app from "../../src/app";
import prisma from "../../src/database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const server = supertest(app);

beforeEach(async () => {
  await prisma.credential.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("POST /sign-up", () => {
  it("should return 422 when body is empty", async () => {
    const response = await server.post("/sign-up").send({});
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when name is missing", async () => {
    const user = generateSignUpData();
    delete user.name;

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when email is missing", async () => {
    const user = generateSignUpData();
    delete user.email;

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when password is missing", async () => {
    const user = generateSignUpData();
    delete user.password;

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when name is too short", async () => {
    const user = generateSignUpData();
    user.name = "a"; // Less than 2 characters

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when email is invalid", async () => {
    const user = generateSignUpData();
    user.email = "invalid-email";

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when password is too short", async () => {
    const user = generateSignUpData();
    user.password = "12345"; // Less than 6 characters

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 409 when email is already registered", async () => {
    const user = generateSignUpData();
    await createUser(user);

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it("should return 201 and create user when data is valid", async () => {
    const user = generateSignUpData();

    const response = await server.post("/sign-up").send(user);
    expect(response.status).toBe(httpStatus.CREATED);

    const createdUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    
    // Password should be hashed
    const passwordMatch = await bcrypt.compare(user.password, createdUser.password);
    expect(passwordMatch).toBe(true);
  });
});

describe("POST /sign-in", () => {
  it("should return 422 when body is empty", async () => {
    const response = await server.post("/sign-in").send({});
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when email is missing", async () => {
    const credentials = {
      password: faker.internet.password({ length: 10 }),
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when password is missing", async () => {
    const credentials = {
      email: faker.internet.email(),
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when email is invalid", async () => {
    const credentials = {
      email: "invalid-email",
      password: faker.internet.password({ length: 10 }),
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 422 when password is too short", async () => {
    const credentials = {
      email: faker.internet.email(),
      password: "12345", // Less than 6 characters
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 404 when email is not registered", async () => {
    const credentials = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 401 when password is incorrect", async () => {
    const user = generateSignUpData();
    await createUser(user);

    const credentials = {
      email: user.email,
      password: faker.internet.password({ length: 10 }),
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 200 and a token when credentials are valid", async () => {
    const user = generateSignUpData();
    await createUser(user);

    const credentials = {
      email: user.email,
      password: user.password,
    };

    const response = await server.post("/sign-in").send(credentials);
    expect(response.status).toBe(httpStatus.OK);
    
    // Verify token is valid JWT
    const token = response.text;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("userId");
  });
});

// Helper functions
function generateSignUpData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
}

async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });
}
