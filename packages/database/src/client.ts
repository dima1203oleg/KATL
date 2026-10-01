import { Pool, PoolConfig } from 'pg';

let poolInstance: Pool | null = null;

export function getDatabasePool(config?: PoolConfig): Pool {
  if (!poolInstance) {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://katl_user:katl_secure_password_2026@localhost:5432/katl_production';

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
