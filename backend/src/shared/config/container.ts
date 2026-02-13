import { container } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { db } from "../../database/connection";
import { NotesRepository } from "../../features/notes/notes.repository";
import { NotesService } from "../../features/notes/notes.service";
import { UsersRepository } from "../../features/users/users.repository";
import { UsersService } from "../../features/users/users.service";
import { AuthService } from "../../features/auth/auth.service";

const connectionManager = new ConnectionManager(db);
container.register<ConnectionManager>("ConnectionManager", {
  useValue: connectionManager,
});

// - Notes -
container.register("NotesRepository", {
  useClass: NotesRepository,
});

container.register("NotesService", {
  useClass: NotesService,
});

// - Users -

container.register("UsersRepository", {
  useClass: UsersRepository,
});

container.register("UsersService", {
  useClass: UsersService,
});

// - Auth -

container.register("AuthService", {
  useClass: AuthService,
});
