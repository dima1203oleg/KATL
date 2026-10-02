import { getDatabasePool, closeDatabasePool } from './client';

/**
 * Deliberately does not seed product or specification fixtures. CATL catalog
 * records must be entered through the reviewed PIM workflow with evidence.
 */
export async function seedDatabase() {
  try {
    await getDatabasePool().query('SELECT 1');
    console.log('[Seed Framework] Database is reachable; no unverified business data was seeded.');
  } finally {
    await closeDatabasePool();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().catch((error) => {
    console.error('[Seed Framework Error]:', error);
    process.exit(1);
  });
}
