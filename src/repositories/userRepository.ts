import prisma from "../database/database";

async function deleteAccount(userId: number) {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

const userRepository = {
  deleteAccount,
};

export default userRepository;
