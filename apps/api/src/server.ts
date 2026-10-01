/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Standalone entry point for @katl/api
 */

import app from './app';

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`[@katl/api] Canonical REST API server listening on port ${PORT}`);
});

export default app;
