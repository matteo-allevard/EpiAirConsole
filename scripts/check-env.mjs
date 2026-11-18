// Checks that everything needed to run the project is in place before `npm run dev`.
// Fails with an explicit message (and a fix) instead of a cryptic stack trace.

import { existsSync, readFileSync, copyFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Returns the minimum major version from a semver range such as ">=22" or "^22.1.0". */
export function minMajor(range) {
  const match = /(\d+)/.exec(range ?? '');
  return match ? Number(match[1]) : 0;
}

/** True when `version` (e.g. "v22.11.0") is at least `required` major. */
export function isVersionSatisfied(version, required) {
  const major = Number(String(version).replace(/^v/, '').split('.')[0]);
  return Number.isFinite(major) && major >= required;
}

/** Minimal .env parser: KEY=value lines, ignores comments and blank lines. */
export function parseEnv(text) {
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

/** Resolves to true when nothing listens on `port`. */
export function isPortFree(port) {
  return new Promise((resolve) => {
    const server = createServer()
      .once('error', () => resolve(false))
      .once('listening', () => server.close(() => resolve(true)))
      .listen(port, '0.0.0.0');
  });
}

async function main() {
  const errors = [];
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

  // 1. Node.js version
  const required = minMajor(pkg.engines?.node);
  if (!isVersionSatisfied(process.version, required)) {
    errors.push(
      `Node.js ${required} or newer is required, you have ${process.version}.\n` +
        `   Fix: install the LTS version from https://nodejs.org (or run \`nvm use\`).`,
    );
  }

  // 2. Dependencies installed
  if (!existsSync(join(ROOT, 'node_modules', 'concurrently'))) {
    errors.push('Dependencies are not installed.\n   Fix: run `npm install` at the root of the project.');
  }

  // 3. Environment file: created from the example on first run
  const envPath = join(ROOT, '.env');
  const examplePath = join(ROOT, '.env.example');
  if (!existsSync(envPath)) {
    if (existsSync(examplePath)) {
      copyFileSync(examplePath, envPath);
      console.log('ℹ No .env file found: created one from .env.example.');
    } else {
      errors.push('Neither .env nor .env.example was found.\n   Fix: restore .env.example from Git.');
    }
  }

  // 4. Ports available
  if (existsSync(envPath)) {
    const env = parseEnv(readFileSync(envPath, 'utf8'));
    const ports = {
      PORT: Number(env.PORT ?? 3000),
      CONSOLE_PORT: Number(env.CONSOLE_PORT ?? 5173),
      CONTROLLER_PORT: Number(env.CONTROLLER_PORT ?? 5174),
    };
    for (const [name, port] of Object.entries(ports)) {
      if (!(await isPortFree(port))) {
        errors.push(
          `Port ${port} (${name}) is already in use.\n` +
            `   Fix: stop the program using it, or change ${name} in your .env file.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n✖ Cannot start the project:\n');
    for (const error of errors) console.error(` - ${error}\n`);
    process.exit(1);
  }
  console.log('✔ Environment OK, starting server, console and controller…');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
