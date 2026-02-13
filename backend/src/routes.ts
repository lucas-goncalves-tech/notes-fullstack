import { Router } from "express";
import notesRouter from "./features/notes/notes.route";
import authRouter from "./features/auth/auth.routes";

const router = Router();

router.use("/notes", notesRouter);
router.use("/auth", authRouter);

export default router;
