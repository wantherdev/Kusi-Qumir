import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workspace = fileURLToPath(new URL('..', import.meta.url));
const children = new Set();
let stopping = false;

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: workspace,
    stdio: 'inherit',
    ...options,
  });
  children.add(child);
  child.once('exit', () => children.delete(child));
  return child;
}

function waitFor(child) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`El proceso terminó con código ${code ?? 'desconocido'}.`));
    });
  });
}

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill('SIGTERM');
  setTimeout(() => process.exit(exitCode), 250);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stop());
}

try {
  console.log('Compilando la API…');
  await waitFor(run('pnpm', ['--dir', 'backend', 'build']));

  const api = run('node', ['dist/src/main.js'], {
    cwd: `${workspace}/backend`,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? 'development',
      PORT: process.env.PORT ?? '3000',
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://kusi_qumir:development-only@localhost:5432/kusi_qumir',
      CORS_ORIGINS:
        process.env.CORS_ORIGINS ??
        'http://localhost:4200,http://127.0.0.1:4200,http://192.168.18.39:4200',
      CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL ?? 'kusiqumir@gmail.com',
      PRIVACY_POLICY_VERSION: process.env.PRIVACY_POLICY_VERSION ?? 'draft-disabled',
    },
  });
  const frontend = run('pnpm', ['--dir', 'frontend', 'start']);

  api.once('exit', (code) => stop(code ?? 1));
  frontend.once('exit', (code) => stop(code ?? 1));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  stop(1);
}
