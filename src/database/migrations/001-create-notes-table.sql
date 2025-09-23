CREATE TABLE IF NOT EXISTS "notes" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "importance" TEXT NOT NULL DEFAULT 'baixo' CHECK (importance IN ('baixo', 'medio', 'alto')),
  "completed" INTEGER DEFAULT 0 CHECK (completed IN (0,1)),
  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY("user_id") REFERENCES "users"("id")
) STRICT;