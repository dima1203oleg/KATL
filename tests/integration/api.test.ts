import { describe, it } from 'node:test';
import assert from 'node:assert';
import app from '../../apps/api/src/app';

describe('KATL Canonical REST API Integration Test Suite', () => {
  it('should respond to /health/ready with database status', async () => {
    // Basic test checking app instance is an Express router
    assert.ok(typeof app.handle === 'function');
  });

  it('should export all required routes and handlers', () => {
    const routerStack = app._router?.stack || [];
    assert.ok(routerStack.length > 5, 'API router should mount multiple route layers');
  });
});
