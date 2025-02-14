import userRepository from "../repositories/userRepository";

async function deleteAccount(userId: number) {
  await userRepository.deleteAccount(userId);
}

const userServices = {
  deleteAccount,
};

export default userServices;
