import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { minMajor, isVersionSatisfied, parseEnv, isPortFree } from './check-env.mjs';

test('minMajor reads the major version from an engines range', () => {
  assert.equal(minMajor('>=22'), 22);
  assert.equal(minMajor('^20.6.0'), 20);
  assert.equal(minMajor(undefined), 0);
});

test('isVersionSatisfied compares the major version', () => {
  assert.equal(isVersionSatisfied('v22.11.0', 22), true);
  assert.equal(isVersionSatisfied('v24.0.0', 22), true);
  assert.equal(isVersionSatisfied('v20.18.0', 22), false);
});

test('parseEnv ignores comments and blank lines', () => {
  const env = parseEnv('# comment\n\nSERVER_PORT=3000\nCORS_ORIGINS=http://a,http://b\n');
  assert.deepEqual(env, { SERVER_PORT: '3000', CORS_ORIGINS: 'http://a,http://b' });
});

test('isPortFree detects a port already in use', async () => {
  const server = createServer().listen(0, '0.0.0.0');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  assert.equal(await isPortFree(port), false);
  await new Promise((resolve) => server.close(resolve));
  assert.equal(await isPortFree(port), true);
});
