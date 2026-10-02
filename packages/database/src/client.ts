import { Pool, PoolConfig } from 'pg';

let poolInstance: Pool | null = null;

export function getDatabasePool(config?: PoolConfig): Pool {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is required; refusing to use an implicit database credential.');
    }

    poolInstance = new Pool(
      config || {
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    );

    poolInstance.on('error', (err) => {
      console.error('[Database Pool Error]:', err);
    });
  }

  return poolInstance;
}

export async function closeDatabasePool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
  }
}
