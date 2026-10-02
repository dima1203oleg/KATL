import { randomUUID } from 'node:crypto';
import { hashPassword } from '../apps/api/src/auth';
import { closeDatabasePool, getDatabasePool } from '../packages/database/src/client';

async function main() {
  const email = process.env.KATL_USER_EMAIL?.trim().toLowerCase();
  const name = process.env.KATL_USER_NAME?.trim();
  const password = process.env.KATL_USER_PASSWORD;
  if (!email || !name || !password) {
    throw new Error('Set KATL_USER_EMAIL, KATL_USER_NAME, and KATL_USER_PASSWORD in the environment.');
  }

  const pool = getDatabasePool();
  const result = await pool.query(
    `INSERT INTO users (id, email, name, role, password_hash)
     VALUES ($1, $2, $3, 'SUPER_ADMIN', $4)
     ON CONFLICT (email) DO NOTHING`,
    [`usr-${randomUUID()}`, email, name, hashPassword(password)]
  );
  if (result.rowCount !== 1) {
    throw new Error('That email already exists; provisioning never changes an existing account role.');
  }
  console.log(`Provisioned SUPER_ADMIN account for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'User provisioning failed.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabasePool();
  });
