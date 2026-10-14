// Keys a terminal sends as other bytes than xterm's. xterm sends Enter as CR with or without
// Shift, so a program in the shell cannot tell Shift+Enter from Enter.

// Shift+Enter sends ESC and CR, the bytes xterm sends for Alt+Enter. Claude Code and other line
// editors read them as a new line, and zsh adds a line to the command. bash rings its bell and
// runs nothing.
export const SHIFT_ENTER = '\x1b\r';

type KeyEvent = Pick<
  KeyboardEvent,
  'type' | 'key' | 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey' | 'isComposing'
>;

// The bytes a key press sends in place of xterm's, or null to leave the key to xterm. An Enter
// that ends a composition, as in a Japanese input method, stays the input method's.
export function keyInput(event: KeyEvent): string | null {
  if (event.type !== 'keydown' || event.isComposing) return null;
  const { key, shiftKey, altKey, ctrlKey, metaKey } = event;
  if (key === 'Enter' && shiftKey && !altKey && !ctrlKey && !metaKey) return SHIFT_ENTER;
  return null;
}
