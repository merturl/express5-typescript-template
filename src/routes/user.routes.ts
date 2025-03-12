import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/user.comtroller";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

export default router;
