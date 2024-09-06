import bcrypt, { hash } from "bcrypt";

const hashPassword = (password: string, rounds: number) => {
  return new Promise<unknown>((resolve, reject) => {
    bcrypt.hash(password, rounds, (error, encrypted) => {
      if (error) reject(error);

      resolve(encrypted);
    });
  });
};
export default hashPassword;