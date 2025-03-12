import { Router } from "express";
import apiRoutes from "./user.routes";

const router = Router();

// API 라우트
router.use("/api", apiRoutes);

export default router;
