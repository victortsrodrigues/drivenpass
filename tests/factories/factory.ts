import { faker } from "@faker-js/faker";
import prisma from "../../src/database/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cryptr } from "../integration/credentials.integration.test";

export async function createUser() {
  const password = faker.internet.password({ length: 10 });
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
    },
  });
}

export function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
}

export function generateCredential() {
  return {
    title: faker.lorem.word(),
    url: faker.internet.url(),
    username: faker.internet.username(),
    password: faker.internet.password({ length: 8 }),
  };
}

export async function createCredential(credential: any, userId: number) {
  const hashedPassword = cryptr.encrypt(credential.password);
  
  return prisma.credential.create({
    data: {
      title: credential.title,
      url: credential.url,
      username: credential.username,
      password: hashedPassword,
      user_id: userId,
    },
  });
}