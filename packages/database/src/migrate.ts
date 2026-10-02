import fs from 'fs';
import path from 'path';
import { getDatabasePool, closeDatabasePool } from './client';

export async function runMigrations() {
  const pool = getDatabasePool();
  console.log('[Migration Framework] Connecting to PostgreSQL database...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const workingDirectory = process.cwd();
    const migrationsDir = [
      path.join(workingDirectory, 'migrations'),
      path.join(workingDirectory, 'packages', 'database', 'migrations'),
      path.resolve(workingDirectory, '../../packages/database/migrations'),
    ].find((candidate) => fs.existsSync(candidate));
    if (!migrationsDir) {
      throw new Error(`No migrations directory found from ${workingDirectory}`);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const { rows: appliedRows } = await client.query('SELECT version FROM schema_migrations;');
    const appliedSet = new Set(appliedRows.map((r) => r.version));

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`[Migration Framework] Skipping already applied: ${file}`);
        continue;
      }

      console.log(`[Migration Framework] Applying migration: ${file}`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sqlContent);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1);', [file]);
      console.log(`[Migration Framework] Successfully applied: ${file}`);
    }

    await client.query('COMMIT');
    console.log('[Migration Framework] All migrations applied successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Migration Framework Error]:', err);
    throw err;
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

if (process.argv[1] && ['migrate.ts', 'migrate.mjs'].includes(path.basename(process.argv[1]))) {
  runMigrations().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
