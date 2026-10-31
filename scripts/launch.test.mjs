import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { launchGate } from './launch-gate.mjs';
import { launchTimestamp, remainingAt } from '../frontend/public/lanzamiento/launch-config.mjs';

test('Peru deadline and countdown boundaries', () => {
  assert.equal(new Date(launchTimestamp).toISOString(), '2026-11-01T15:00:00.000Z');
  assert.deepEqual(remainingAt(launchTimestamp - 93784000), { days: 1, hours: 2, minutes: 3, seconds: 4, total: 93784 });
  assert.equal(remainingAt(launchTimestamp - 1).total, 1);
  assert.equal(remainingAt(launchTimestamp).total, 0);
  assert.equal(remainingAt(launchTimestamp + 1000).total, 0);
});

test('gate redirects before launch and stays on official page at and after deadline', () => {
  for (const base of ['/Kusi-Qumir/', '/']) {
    for (const offset of [-1, 0, 1]) {
      const destinations = [];
      runInNewContext(launchGate(base).replace(/^<script[^>]*>|<\/script>$/g, ''), {
        Date: { now: () => launchTimestamp + offset },
        window: { location: { replace: (url) => destinations.push(url) } },
      });
      assert.deepEqual(destinations, offset < 0 ? [base + 'lanzamiento/'] : []);
    }
  }
});

test('open countdown switches to official site without a reload by the visitor', async () => {
  const source = (await readFile(new URL('../frontend/public/lanzamiento/countdown.js', import.meta.url), 'utf8')).replace(/^import[^;]+;/, '');
  let now = launchTimestamp - 1000;
  let tick;
  const nodes = new Map();
  const listeners = {};
  const destinations = [];
  const node = (id) => { if (!nodes.has(id)) nodes.set(id, {}); return nodes.get(id); };
  runInNewContext(source, {
    remainingAt, officialWebsite: 'https://example.test/Kusi-Qumir/',
    Date: { now: () => now },
    setInterval: (fn) => { tick = fn; return 1; }, clearInterval: () => {},
    document: { getElementById: node, querySelector: node, addEventListener: (event, fn) => { listeners[event] = fn; } },
    window: { location: { replace: (url) => destinations.push(url) }, addEventListener: (event, fn) => { listeners[event] = fn; } },
  });
  assert.equal(node('seconds').textContent, '01');
  assert.equal(destinations.length, 0);
  now = launchTimestamp;
  tick();
  assert.deepEqual(destinations, ['https://example.test/Kusi-Qumir/']);
  assert.equal(node('.launch-website').hidden, false);
});
