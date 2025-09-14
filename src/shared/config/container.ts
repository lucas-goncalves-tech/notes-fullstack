import { container } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { db } from "../../database/connection";
import { NotesRepository } from "../../features/notes/notes.repository";
import { NotesService } from "../../features/notes/notes.service";
import { UsersRepository } from "../../features/users/users.repository";

// --- REGISTO DE INSTÂNCIAS (SINGLETONS) ---
const connectionManager = new ConnectionManager(db);
container.register<ConnectionManager>("ConnectionManager", {
  useValue: connectionManager,
});

// --- REGISTO DE CLASSES ---
container.register("NotesRepository", {
  useClass: NotesRepository,
});

container.register("NotesService", {
  useClass: NotesService,
});

container.register("UsersRepository", {
  useClass: UsersRepository,
});
