import { formatDate, isValidDate } from '../date-utils';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    const testDate = new Date('2023-05-15T12:00:00Z');

    it('should format date in MM/DD/YYYY by default', () => {
      expect(formatDate(testDate)).toBe('05/15/2023');
    });

    it('should format date in DD/MM/YYYY', () => {
      expect(formatDate(testDate, 'DD/MM/YYYY')).toBe('15/05/2023');
    });

    it('should format date in YYYY-MM-DD', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2023-05-15');
    });

    it('should handle different dates', () => {
      const newDate = new Date('2024-12-31T00:00:00Z');
      expect(formatDate(newDate)).toBe('12/31/2024');
    });
  });

  describe('isValidDate', () => {
    it('should validate dates in MM/DD/YYYY format', () => {
      expect(isValidDate('05/15/2023')).toBe(true);
      expect(isValidDate('02/29/2020')).toBe(true); // leap year
      expect(isValidDate('02/29/2021')).toBe(false); // not a leap year
    });

    it('should validate dates in DD/MM/YYYY format', () => {
      expect(isValidDate('15/05/2023', 'DD/MM/YYYY')).toBe(true);
      expect(isValidDate('29/02/2020', 'DD/MM/YYYY')).toBe(true); // leap year
      expect(isValidDate('29/02/2021', 'DD/MM/YYYY')).toBe(false); // not a leap year
    });

    it('should validate dates in YYYY-MM-DD format', () => {
      expect(isValidDate('2023-05-15', 'YYYY-MM-DD')).toBe(true);
      expect(isValidDate('2020-02-29', 'YYYY-MM-DD')).toBe(true); // leap year
      expect(isValidDate('2021-02-29', 'YYYY-MM-DD')).toBe(false); // not a leap year
    });

    it('should handle invalid dates', () => {
      expect(isValidDate('13/32/2023')).toBe(false);
      expect(isValidDate('00/00/0000')).toBe(false);
      expect(isValidDate('31/04/2023', 'DD/MM/YYYY')).toBe(false); // April has 30 days
    });

    it('should handle edge cases', () => {
      expect(isValidDate('02/28/2021')).toBe(true);
      expect(isValidDate('02/29/2020')).toBe(true);
      expect(isValidDate('02/29/2021')).toBe(false);
    });
  });
});
