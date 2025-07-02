import { matches } from '../keyboard/match';
import * as keys from '../keyboard/keys';

describe('matches function', () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = {
      key: 'Enter',
      which: 13,
      keyCode: 13,
    };
  });

  test('returns true when event matches one of the keys', () => {
    const result = matches(mockEvent, [keys.Enter, keys.Space]);
    expect(result).toBe(true);
  });

  test('returns false when event does not match any of the keys', () => {
    const result = matches(mockEvent, [keys.Space, keys.Escape]);
    expect(result).toBe(false);
  });

  test('works with an array of key strings', () => {
    const result = matches(mockEvent, [{ key: ['Enter', 'Return'] }]);
    expect(result).toBe(true);
  });

  test('matches based on which property', () => {
    const result = matches({ which: 32 }, [keys.Space]);
    expect(result).toBe(true);
  });

  test('matches based on keyCode property', () => {
    const result = matches({ keyCode: 27 }, [keys.Escape]);
    expect(result).toBe(true);
  });

  test('returns false for an empty array of keys to match', () => {
    const result = matches(mockEvent, []);
    expect(result).toBe(false);
  });
});
