// Shift+Enter sends ESC and CR, so a program such as Claude Code can tell it from Enter. Every
// other key, and Enter with any other modifier, stays xterm's.
import { describe, expect, it } from 'vitest';
import { keyInput, SHIFT_ENTER } from '@/renderer/terminalKeys';

const press = (key: string, modifiers: Partial<KeyboardEvent> = {}) => ({
  type: 'keydown',
  key,
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  isComposing: false,
  ...modifiers,
});

describe('keyInput', () => {
  it('sends ESC and CR for Shift+Enter', () => {
    expect(SHIFT_ENTER).toBe('\x1b\r');
    expect(keyInput(press('Enter', { shiftKey: true }))).toBe('\x1b\r');
  });

  it('leaves Enter without Shift to xterm', () => {
    expect(keyInput(press('Enter'))).toBeNull();
  });

  it('leaves Shift+Enter with another modifier to xterm', () => {
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey'] as const) {
      expect(keyInput(press('Enter', { shiftKey: true, [modifier]: true }))).toBeNull();
    }
  });

  it('acts on the key going down only', () => {
    for (const type of ['keypress', 'keyup']) {
      expect(keyInput(press('Enter', { type, shiftKey: true }))).toBeNull();
    }
  });

  it('leaves an Enter that ends a composition to the input method', () => {
    expect(keyInput(press('Enter', { shiftKey: true, isComposing: true }))).toBeNull();
  });

  it('leaves other keys with Shift to xterm', () => {
    for (const key of ['a', 'Tab', 'Backspace', 'ArrowUp']) {
      expect(keyInput(press(key, { shiftKey: true }))).toBeNull();
    }
  });
});
