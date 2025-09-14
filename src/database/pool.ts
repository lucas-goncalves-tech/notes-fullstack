import { Database } from "better-sqlite3";

export class ConnectionManager {
  constructor(private db: Database) {}

  acquire(): Database {
    return this.db;
  }

  release(connection: Database) {
    return connection;
  }
}
