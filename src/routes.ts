import { Router } from "express";
import notesRouter from "./features/notes/notes.route";

const router = Router();

router.use("/notes", notesRouter);

export default router;
