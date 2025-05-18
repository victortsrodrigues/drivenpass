import { jest } from "@jest/globals";
import credentialsServices from "../../src/services/credentialsServices";
import credentialsRepository from "../../src/repositories/credentialsRepository";
import { conflictError } from "../../src/errors/conflictError";
import { notFoundError } from "../../src/errors/notFoundError";
import { badRequestError } from "../../src/errors/badRequestError";

// Mock do Cryptr
jest.mock("cryptr", () => {
  return jest.fn().mockImplementation(() => {
    return {
      encrypt: jest
        .fn()
        .mockImplementation((password: string) => `encrypted_${password}`),
      decrypt: jest
        .fn()
        .mockImplementation((password: string) =>
          password.replace("encrypted_", "")
        ),
    };
  });
});

describe("Credentials Services Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCredential", () => {
    it("should create a credential successfully", async () => {
      const mockBody = {
        title: "Test Credential",
        url: "https://test.com",
        username: "testuser",
        password: "testpassword",
      };
      const mockUserId = 1;

      jest
        .spyOn(credentialsRepository, "findCredentialByTitleAndId")
        .mockResolvedValueOnce(null);
      jest
        .spyOn(credentialsRepository, "createCredential")
        .mockResolvedValueOnce(undefined as any);

      await credentialsServices.createCredential(mockBody, mockUserId);

      expect(
        credentialsRepository.findCredentialByTitleAndId
      ).toHaveBeenCalledWith(mockBody.title, mockUserId);
      expect(credentialsRepository.createCredential).toHaveBeenCalledWith(
        mockBody,
        mockUserId,
        "encrypted_testpassword"
      );
    });

    it("should throw conflict error if credential with same title exists", async () => {
      const mockBody = {
        title: "Test Credential",
        url: "https://test.com",
        username: "testuser",
        password: "testpassword",
      };
      const mockUserId = 1;
      const existingCredential = {
        id: 1,
        ...mockBody,
        user_id: mockUserId,
        password: "encrypted_password",
      };

      jest
        .spyOn(credentialsRepository, "findCredentialByTitleAndId")
        .mockResolvedValueOnce(existingCredential as any);

      const promise = credentialsServices.createCredential(
        mockBody,
        mockUserId
      );

      await expect(promise).rejects.toEqual(
        conflictError("Credential with the same title")
      );
      expect(
        credentialsRepository.findCredentialByTitleAndId
      ).toHaveBeenCalledWith(mockBody.title, mockUserId);
      expect(credentialsRepository.createCredential).not.toHaveBeenCalled();
    });
  });

  describe("getCredentials", () => {
    it("should return all credentials for a user with decrypted passwords", async () => {
      const mockUserId = 1;
      const mockCredentials = [
        {
          id: 1,
          title: "Test Credential 1",
          url: "https://test1.com",
          username: "testuser1",
          password: "encrypted_password1",
          user_id: mockUserId,
        },
        {
          id: 2,
          title: "Test Credential 2",
          url: "https://test2.com",
          username: "testuser2",
          password: "encrypted_password2",
          user_id: mockUserId,
        },
      ];

      jest
        .spyOn(credentialsRepository, "getCredentials")
        .mockResolvedValueOnce(mockCredentials as any);

      const result = await credentialsServices.getCredentials(mockUserId);

      expect(credentialsRepository.getCredentials).toHaveBeenCalledWith(
        mockUserId
      );
      expect(result).toEqual([
        {
          ...mockCredentials[0],
          password: "password1",
        },
        {
          ...mockCredentials[1],
          password: "password2",
        },
      ]);
    });
  });

  describe("getCredentialById", () => {
    it("should return a credential by id with decrypted password", async () => {
      const mockId = "1";
      const mockUserId = 1;
      const mockCredential = {
        id: 1,
        title: "Test Credential",
        url: "https://test.com",
        username: "testuser",
        password: "encrypted_password",
        user_id: mockUserId,
      };

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(mockCredential as any);

      const result = await credentialsServices.getCredentialById(
        mockId,
        mockUserId
      );

      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
      expect(result).toEqual({
        ...mockCredential,
        password: "password",
      });
    });

    it("should throw bad request error if id is not a number", async () => {
      const mockId = "abc";
      const mockUserId = 1;

      const promise = credentialsServices.getCredentialById(mockId, mockUserId);

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
    });

    it("should throw bad request error if id is not positive", async () => {
      const mockId = "0";
      const mockUserId = 1;

      const promise = credentialsServices.getCredentialById(mockId, mockUserId);

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
    });

    it("should throw not found error if credential does not exist", async () => {
      const mockId = "1";
      const mockUserId = 1;

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(null);

      const promise = credentialsServices.getCredentialById(mockId, mockUserId);

      await expect(promise).rejects.toEqual(notFoundError("Credential"));
      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
    });
  });

  describe("updateCredential", () => {
    it("should update a credential successfully", async () => {
      const mockId = "1";
      const mockUserId = 1;
      const mockBody = {
        title: "Updated Credential",
        url: "https://updated.com",
        username: "updateduser",
        password: "updatedpassword",
      };
      const mockCredential = {
        id: 1,
        title: "Test Credential",
        url: "https://test.com",
        username: "testuser",
        password: "encrypted_password",
        user_id: mockUserId,
      };

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(mockCredential as any);
      jest
        .spyOn(credentialsRepository, "updateCredential")
        .mockResolvedValueOnce(undefined as any);

      await credentialsServices.updateCredential(mockId, mockBody, mockUserId);

      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
      expect(credentialsRepository.updateCredential).toHaveBeenCalledWith(
        Number(mockId),
        mockBody,
        mockUserId,
        "encrypted_updatedpassword"
      );
    });

    it("should throw bad request error if id is not a number", async () => {
      const mockId = "abc";
      const mockUserId = 1;
      const mockBody = {
        title: "Updated Credential",
        url: "https://updated.com",
        username: "updateduser",
        password: "updatedpassword",
      };

      const promise = credentialsServices.updateCredential(
        mockId,
        mockBody,
        mockUserId
      );

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
      expect(credentialsRepository.updateCredential).not.toHaveBeenCalled();
    });

    it("should throw bad request error if id is not positive", async () => {
      const mockId = "0";
      const mockUserId = 1;
      const mockBody = {
        title: "Updated Credential",
        url: "https://updated.com",
        username: "updateduser",
        password: "updatedpassword",
      };

      const promise = credentialsServices.updateCredential(
        mockId,
        mockBody,
        mockUserId
      );

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
      expect(credentialsRepository.updateCredential).not.toHaveBeenCalled();
    });

    it("should throw not found error if credential does not exist", async () => {
      const mockId = "1";
      const mockUserId = 1;
      const mockBody = {
        title: "Updated Credential",
        url: "https://updated.com",
        username: "updateduser",
        password: "updatedpassword",
      };

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(null);

      const promise = credentialsServices.updateCredential(
        mockId,
        mockBody,
        mockUserId
      );

      await expect(promise).rejects.toEqual(notFoundError("Credential"));
      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
      expect(credentialsRepository.updateCredential).not.toHaveBeenCalled();
    });
  });

  describe("deleteCredential", () => {
    it("should delete a credential successfully", async () => {
      const mockId = "1";
      const mockUserId = 1;
      const mockCredential = {
        id: 1,
        title: "Test Credential",
        url: "https://test.com",
        username: "testuser",
        password: "encrypted_password",
        user_id: mockUserId,
      };

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(mockCredential as any);
      jest
        .spyOn(credentialsRepository, "deleteCredential")
        .mockResolvedValueOnce(undefined as any);

      await credentialsServices.deleteCredential(mockId, mockUserId);

      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
      expect(credentialsRepository.deleteCredential).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
    });

    it("should throw bad request error if id is not a number", async () => {
      const mockId = "abc";
      const mockUserId = 1;

      const promise = credentialsServices.deleteCredential(mockId, mockUserId);

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
      expect(credentialsRepository.deleteCredential).not.toHaveBeenCalled();
    });

    it("should throw bad request error if id is not positive", async () => {
      const mockId = "0";
      const mockUserId = 1;

      const promise = credentialsServices.deleteCredential(mockId, mockUserId);

      await expect(promise).rejects.toEqual(badRequestError("Id"));
      expect(credentialsRepository.getCredentialById).not.toHaveBeenCalled();
      expect(credentialsRepository.deleteCredential).not.toHaveBeenCalled();
    });

    it("should throw not found error if credential does not exist", async () => {
      const mockId = "1";
      const mockUserId = 1;

      jest
        .spyOn(credentialsRepository, "getCredentialById")
        .mockResolvedValueOnce(null);

      const promise = credentialsServices.deleteCredential(mockId, mockUserId);

      await expect(promise).rejects.toEqual(notFoundError("Credential"));
      expect(credentialsRepository.getCredentialById).toHaveBeenCalledWith(
        Number(mockId),
        mockUserId
      );
      expect(credentialsRepository.deleteCredential).not.toHaveBeenCalled();
    });
  });
});
