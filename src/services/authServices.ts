import { conflictError } from "../errors/conflictError";
import { BodySignUp } from "../protocols/authProtocol";
import authRepository from "../repositories/authRepository";


export async function signUp(body: BodySignUp) {
  const { name, email, password } = body;
  const userExists = await authRepository.findByEmail(email);
  console.log(userExists);
  if (userExists) throw conflictError("User");

  // create user
  await authRepository.insertUser(name, email, password);
}

const authServices = {
  signUp,
};

export default authServices;