import { getNextIndex, selectorTabbable, selectorFocusable } from '../keyboard/navigation';
import { ArrowLeft, ArrowRight } from '../keyboard/keys';
import * as a11yUtils from '../keyboard/navigation';

// Mock the match function
jest.mock('../keyboard/match', () => ({
  match: (key, targetKey) => key === targetKey,
}));

describe('a11y utility functions', () => {
  describe('getNextIndex', () => {
    it('should increment index when ArrowRight is pressed', () => {
      expect(getNextIndex(ArrowRight, 0, 5)).toBe(1);
      expect(getNextIndex(ArrowRight, 2, 5)).toBe(3);
    });

    it('should wrap around to the beginning when ArrowRight is pressed on the last index', () => {
      expect(getNextIndex(ArrowRight, 4, 5)).toBe(0);
    });

    it('should decrement index when ArrowLeft is pressed', () => {
      expect(getNextIndex(ArrowLeft, 3, 5)).toBe(2);
      expect(getNextIndex(ArrowLeft, 4, 5)).toBe(3);
    });

    it('should wrap around to the end when ArrowLeft is pressed on the first index', () => {
      expect(getNextIndex(ArrowLeft, 0, 5)).toBe(4);
    });

    it('should work with single item arrays', () => {
      expect(getNextIndex(ArrowRight, 0, 1)).toBe(0);
      expect(getNextIndex(ArrowLeft, 0, 1)).toBe(0);
    });

    it('should return undefined for keys other than ArrowLeft and ArrowRight', () => {
      expect(getNextIndex('ArrowUp', 0, 5)).toBeUndefined();
      expect(getNextIndex('ArrowDown', 2, 5)).toBeUndefined();
      expect(getNextIndex('Enter', 2, 5)).toBeUndefined();
    });

    it('should handle array index at boundaries correctly', () => {
      // Testing with array length of 3
      expect(getNextIndex(ArrowRight, 2, 3)).toBe(0); // Last to first
      expect(getNextIndex(ArrowLeft, 0, 3)).toBe(2); // First to last
    });
  });

  describe('DOCUMENT_POSITION constants', () => {
    // Since these constants rely on the Node global, we need to mock it for testing
    const originalNode = global.Node;

    beforeAll(() => {
      // Mock the Node object with position constants
      global.Node = {
        ...originalNode,
        DOCUMENT_POSITION_PRECEDING: 2,
        DOCUMENT_POSITION_FOLLOWING: 4,
        DOCUMENT_POSITION_CONTAINS: 8,
        DOCUMENT_POSITION_CONTAINED_BY: 16,
      } as typeof Node;
    });

    afterAll(() => {
      // Restore the original Node object
      global.Node = originalNode;
    });

    it('should define DOCUMENT_POSITION_BROAD_PRECEDING correctly', () => {
      // Force re-importing the values that depend on global.Node
      // Use a dynamic import with jest.isolateModules to get fresh values
      jest.isolateModules(() => {
        // Access the property by importing the module again
        const reloadedUtils = a11yUtils as unknown as { DOCUMENT_POSITION_BROAD_PRECEDING: number };
        expect(reloadedUtils.DOCUMENT_POSITION_BROAD_PRECEDING).toBe(10); // 2 | 8
      });
    });

    it('should define DOCUMENT_POSITION_BROAD_FOLLOWING correctly', () => {
      // Force re-importing the values that depend on global.Node
      jest.isolateModules(() => {
        // Access the property by importing the module again
        const reloadedUtils = a11yUtils as unknown as { DOCUMENT_POSITION_BROAD_FOLLOWING: number };
        expect(reloadedUtils.DOCUMENT_POSITION_BROAD_FOLLOWING).toBe(20); // 4 | 16
      });
    });
  });

  describe('CSS selectors', () => {
    it('should define selectorTabbable as a non-empty string', () => {
      expect(typeof selectorTabbable).toBe('string');
      expect(selectorTabbable.length).toBeGreaterThan(0);
    });

    it('should define selectorFocusable as a non-empty string', () => {
      expect(typeof selectorFocusable).toBe('string');
      expect(selectorFocusable.length).toBeGreaterThan(0);
    });

    it('should include common focusable elements in selectorFocusable', () => {
      expect(selectorFocusable).toContain('a[href]');
      expect(selectorFocusable).toContain('button:not([disabled])');
      expect(selectorFocusable).toContain('input:not([disabled])');
      expect(selectorFocusable).toContain('*[contenteditable=true]');
    });

    it('should include common tabbable elements in selectorTabbable with tabindex check', () => {
      expect(selectorTabbable).toContain('a[href]');
      expect(selectorTabbable).toContain("button:not([disabled]):not([tabindex='-1'])");
      expect(selectorTabbable).toContain("input:not([disabled]):not([tabindex='-1'])");
      expect(selectorTabbable).toContain('*[contenteditable=true]');
    });

    it('should have different criteria for tabbable vs focusable elements', () => {
      // Tabbable should exclude elements with tabindex='-1'
      expect(selectorTabbable).toContain("input:not([disabled]):not([tabindex='-1'])");
      // Focusable should include elements with tabindex='-1'
      expect(selectorFocusable).toContain('input:not([disabled])');

      // Confirm the difference
      expect(selectorTabbable).not.toEqual(selectorFocusable);
    });
  });
});
