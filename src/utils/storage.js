// Persist the set of words the child marked as "I know it" in Learn mode.
const KEY = 'minecraft-english-known';

export function loadKnown() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch {
    return new Set();
  }
}

export function saveKnown(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* private mode — ignore */
  }
}
