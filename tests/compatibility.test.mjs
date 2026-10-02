import test from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
const jiti = createJiti(import.meta.url, { interopDefault: false, tryNative: false });
const { replayFromBranch } = await jiti.import('../state/replay.ts');
const rpiv = await jiti.import('../index.ts');
const entry = details => ({ type: 'message', message: { role: 'toolResult', toolName: 'todo', details } });
const replay = branch => replayFromBranch({ sessionManager: { getBranch: () => branch } });
test('legacy todos migrate on read, retain IDs, completion and next ID; original entries stay intact', () => {
  const branch = [entry({ todos: [{ id: 1, text: 'Done', done: true }, { id: 4, text: 'Next', done: false }], nextId: 5 })];
  const before = JSON.stringify(branch);
  assert.deepEqual(replay(branch), { tasks: [
    { id: 1, subject: 'Done', status: 'completed' },
    { id: 4, subject: 'Next', status: 'pending' },
  ], nextId: 5 });
  assert.equal(JSON.stringify(branch), before);
});

test('mixed snapshots use the last valid state including clear and malformed history', () => {
  const legacy = entry({ todos: [{ id: 1, text: 'Old', done: false }], nextId: 2 });
  const modern = entry({ tasks: [{ id: 1, subject: 'New', status: 'in_progress' }], nextId: 2 });
  assert.equal(replay([legacy, modern]).tasks[0].subject, 'New');
  assert.equal(replay([modern, legacy]).tasks[0].subject, 'Old');
  assert.deepEqual(replay([legacy, entry({ tasks: [], nextId: 1 })]), { tasks: [], nextId: 1 });
  assert.deepEqual(replay([modern, entry({ todos: [{ id: 'bad' }], nextId: 2 })]).tasks, modern.message.details.tasks);
  assert.equal(replay([entry({ todos: [{ id: 7, text: 'Recovered', done: false }], nextId: 1 })]).nextId, 8);
});

test('real rpiv tool operates on migrated state, validates dependency cycles and isolates sessions', async () => {
  let tool;
  const handlers = new Map();
  rpiv.default({ registerTool: definition => { tool = definition; }, registerCommand() {}, registerShortcut() {},
    on: (name, fn) => handlers.set(name, fn),
  });
  const ctx = id => ({ hasUI: false, sessionManager: { getSessionId: () => id, getBranch: () => [entry({ todos: [{ id: 1, text: 'Original', done: false }], nextId: 2 })] } });
  const call = (session, params) => tool.execute('test', params, undefined, undefined, ctx(session));
  await handlers.get('session_start')({}, ctx('main'));
  let result = await call('main', { action: 'create', subject: 'Dependent', blockedBy: [1] });
  assert.equal(result.details.error, undefined);
  assert.equal(result.details.tasks[1].id, 2);
  result = await call('main', { action: 'update', id: 2, status: 'in_progress', activeForm: 'Implementing', owner: 'implement' });
  assert.equal(result.details.tasks[1].activeForm, 'Implementing');
  result = await call('main', { action: 'update', id: 1, addBlockedBy: [2] });
  assert.match(result.details.error, /cycle/);
  result = await call('child', { action: 'list' });
  assert.deepEqual(result.details.tasks, []);
  result = await call('main', { action: 'list' });
  assert.equal(result.details.tasks.length, 2);
});
