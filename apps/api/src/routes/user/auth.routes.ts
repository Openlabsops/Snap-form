import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../../controllers/user.controller";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;