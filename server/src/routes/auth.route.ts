import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuthenticated, getUser);

export { router as authRouter };
