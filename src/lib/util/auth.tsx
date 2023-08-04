import bcrypt from "bcrypt";

export async function createSalt(): Promise<string> {
  return await bcrypt.genSalt();
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await createSalt();
  return bcrypt.hash(password, salt);
}
