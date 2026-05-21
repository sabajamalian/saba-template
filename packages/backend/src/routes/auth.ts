import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config.js";
import { auth } from "../middleware/auth.js";
import { findUserByEmail, findUserById, User } from "../models/user.js";

const authRouter = Router();

const toSafeUser = ({ passwordHash: _passwordHash, ...user }: User) => user;

authRouter.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  res.json({ token, user: toSafeUser(user) });
});

authRouter.get("/api/auth/me", auth, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await findUserById(req.user.sub);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user: toSafeUser(user) });
});

export default authRouter;
