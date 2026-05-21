import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import { User } from "../models/user.js";
import { getContainer } from "../services/cosmos.js";

const adminRouter = Router();
const USERS_CONTAINER = "users";

const toSafeUser = ({ passwordHash: _passwordHash, ...user }: User) => user;

adminRouter.use(auth, roleGuard("admin"));

adminRouter.get("/api/admin/users", async (_req, res) => {
  const { resources } = await getContainer(USERS_CONTAINER).items.query<User>("SELECT * FROM c").fetchAll();

  res.json({ users: resources.map(toSafeUser) });
});

adminRouter.get("/api/admin/status", (_req, res) => {
  res.json({ status: "admin-ok" });
});

export default adminRouter;
