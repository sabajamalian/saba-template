import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";

import { getContainer } from "../services/cosmos.js";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: string;
}

const USERS_CONTAINER = "users";
const SALT_ROUNDS = 10;

export const createUser = async (
  email: string,
  password: string,
  role: User["role"] = "user",
): Promise<User> => {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user: User = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  await getContainer(USERS_CONTAINER).items.create(user);

  return user;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const querySpec = {
    query: "SELECT TOP 1 * FROM c WHERE c.email = @email",
    parameters: [{ name: "@email", value: normalizedEmail }],
  };
  const { resources } = await getContainer(USERS_CONTAINER).items.query<User>(querySpec).fetchAll();

  return resources[0] ?? null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const querySpec = {
    query: "SELECT TOP 1 * FROM c WHERE c.id = @id",
    parameters: [{ name: "@id", value: id }],
  };
  const { resources } = await getContainer(USERS_CONTAINER).items.query<User>(querySpec).fetchAll();

  return resources[0] ?? null;
};
