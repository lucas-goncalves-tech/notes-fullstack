import { Router } from "express";
import notesRouter from "./features/notes/notes.route";
import usersRouter from "./features/users/users.routes";

const router = Router();

router.use("/notes", notesRouter);
router.use("/users", usersRouter);

export default router;
