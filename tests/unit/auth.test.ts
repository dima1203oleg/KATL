import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPasswordHash } from '../../apps/api/src/auth';

describe('password hashing', () => {
  it('uses salted scrypt hashes and rejects incorrect passwords', () => {
    const password = 'correct horse battery staple';
    const storedHash = hashPassword(password);
    assert.match(storedHash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
    assert.equal(verifyPasswordHash(password, storedHash), true);
    assert.equal(verifyPasswordHash('wrong password', storedHash), false);
  });

  it('rejects passwords shorter than the provisioning policy', () => {
    assert.throws(() => hashPassword('short'), /between 12 and 256/);
  });
});
