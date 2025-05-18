import authServices from "../../src/services/authServices";
import authRepository from "../../src/repositories/authRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conflictError } from "../../src/errors/conflictError";
import { notFoundError } from "../../src/errors/notFoundError";
import { unauthorizedError } from "../../src/errors/unauthorizedError";

jest.mock("../../src/repositories/authRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create a new user when email doesn't exist", async () => {
      // Arrange
      const mockBody = {
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      };
      
      jest.spyOn(authRepository, "findByEmail").mockResolvedValueOnce(null);
      jest.spyOn(authRepository, "insertUser").mockResolvedValueOnce(undefined);

      // Act
      await authServices.signUp(mockBody);

      // Assert
      expect(authRepository.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(authRepository.insertUser).toHaveBeenCalledWith(
        mockBody.name,
        mockBody.email,
        mockBody.password
      );
    });

    it("should throw conflict error when email already exists", async () => {
      // Arrange
      const mockBody = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123"
      };
      
      jest.spyOn(authRepository, "findByEmail").mockResolvedValueOnce({
        id: 1,
        name: "Existing User",
        email: "existing@example.com",
        password: "hashedPassword",
      });

      // Act & Assert
      await expect(authServices.signUp(mockBody)).rejects.toEqual(
        conflictError("User")
      );
      expect(authRepository.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(authRepository.insertUser).not.toHaveBeenCalled();
    });
  });

  describe("signIn", () => {
    it("should return a token when credentials are valid", async () => {
      // Arrange
      const mockBody = {
        email: "test@example.com",
        password: "password123"
      };
      
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword"
      };
      
      const mockToken = "valid.jwt.token";
      
      jest.spyOn(authRepository, "findByEmail").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(true);
      jest.spyOn(jwt, "sign").mockImplementation(() => mockToken);

      // Act
      const result = await authServices.signIn(mockBody);

      // Assert
      expect(result).toBe(mockToken);
      expect(authRepository.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(mockBody.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET);
    });

    it("should throw not found error when email doesn't exist", async () => {
      // Arrange
      const mockBody = {
        email: "nonexistent@example.com",
        password: "password123"
      };
      
      jest.spyOn(authRepository, "findByEmail").mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authServices.signIn(mockBody)).rejects.toEqual(
        notFoundError("Email")
      );
      expect(authRepository.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(bcrypt.compareSync).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should throw unauthorized error when password doesn't match", async () => {
      // Arrange
      const mockBody = {
        email: "test@example.com",
        password: "wrongPassword"
      };
      
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date()
      };
      
      jest.spyOn(authRepository, "findByEmail").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(false);

      // Act & Assert
      await expect(authServices.signIn(mockBody)).rejects.toEqual(
        unauthorizedError("Password")
      );
      expect(authRepository.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(mockBody.password, mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
