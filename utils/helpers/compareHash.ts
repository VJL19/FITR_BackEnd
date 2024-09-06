import bcrypt from "bcrypt";

const compareHashPassword = (data: string, encypted: string) => {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(data, encypted, (error, match) => {
      if (error) reject(error);

      resolve(match);
    });
  });
};
export default compareHashPassword;
