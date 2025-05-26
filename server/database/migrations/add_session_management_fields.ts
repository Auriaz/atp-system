import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export async function up(db: any) {
    // Dodaj nowe kolumny do tabeli refresh_tokens
    await db.run(sql`ALTER TABLE refresh_tokens ADD COLUMN device_name TEXT`)
    await db.run(sql`ALTER TABLE refresh_tokens ADD COLUMN location TEXT`)
    await db.run(sql`ALTER TABLE refresh_tokens ADD COLUMN is_current INTEGER DEFAULT 0`)

    console.log('✅ Migration: Added session management columns to refresh_tokens table')
}

export async function down(db: any) {
    // Usuń dodane kolumny (SQLite nie wspiera DROP COLUMN w łatwy sposób)
    // Tworzymy nową tabelę bez tych kolumn i kopiujemy dane

    await db.run(sql`
    CREATE TABLE refresh_tokens_backup AS 
    SELECT 
      id, user_id, token, device_id, user_agent, ip_address, 
      is_revoked, expires_at, created_at, last_used_at
    FROM refresh_tokens
  `)

    await db.run(sql`DROP TABLE refresh_tokens`)

    await db.run(sql`
    CREATE TABLE refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      device_id TEXT,
      user_agent TEXT,
      ip_address TEXT,
      is_revoked INTEGER DEFAULT 0,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      last_used_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

    await db.run(sql`
    INSERT INTO refresh_tokens 
    SELECT * FROM refresh_tokens_backup
  `)

    await db.run(sql`DROP TABLE refresh_tokens_backup`)

    console.log('✅ Migration: Reverted session management columns from refresh_tokens table')
}
