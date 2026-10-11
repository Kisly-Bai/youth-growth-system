import { generateTimeBlockId, generateFocusSessionId, generateLearningGoalId, generateId } from './utils/idGenerator';

describe('idGenerator', () => {
  test('generates a time block id with the correct prefix', () => {
    const id = generateTimeBlockId();
    expect(id.startsWith('time-block-')).toBe(true);
  });

  test('generates a focus session id with the correct prefix', () => {
    const id = generateFocusSessionId();
    expect(id.startsWith('focus-session-')).toBe(true);
  });

  test('generates a learning goal id with the correct prefix', () => {
    const id = generateLearningGoalId();
    expect(id.startsWith('learning-goal-')).toBe(true);
  });

  test('generates an id with a custom prefix', () => {
    const id = generateId('task');
    expect(id.startsWith('task-')).toBe(true);
  });

  test('generates unique ids', () => {
    const first = generateId('task');
    const second = generateId('task');
    expect(first).not.toBe(second);
  });
});
