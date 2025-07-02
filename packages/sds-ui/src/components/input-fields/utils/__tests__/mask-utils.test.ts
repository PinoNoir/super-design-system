import { getMask, getMaskFromFormat } from '../mask-utils';
import { INPUT_FIELD_FORMAT_TYPES } from '../../constants/input-constants';

describe('Mask Utility Functions', () => {
  describe('getMask', () => {
    it('should return correct mask for credit card', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.CCNumber)).toBe('9999 9999 9999 9999');
    });

    it('should return correct mask for social security number', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.SSNumber)).toBe('999-99-9999');
    });

    it('should return correct mask for phone number', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.PhoneNumber)).toBe('(999) 999-9999');
    });

    it('should return correct mask for zip code', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.ZipCode)).toBe('99999');
    });

    it('should return correct mask for date', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Date)).toBe('99/99/9999');
    });

    it('should return correct mask for date-time', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.DateTime)).toBe('99/99/9999 99:99');
    });

    it('should return correct mask for time', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Time)).toBe('99:99');
    });

    it('should return empty string for currency', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Currency)).toBe('');
    });

    it('should return empty string for percent', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Percent)).toBe('');
    });

    it('should return custom format for custom type', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Custom, 'XXX-XX-XXXX')).toBe('XXX-XX-XXXX');
    });

    it('should return empty string for custom type without custom format', () => {
      expect(getMask(INPUT_FIELD_FORMAT_TYPES.Custom)).toBe('');
    });

    it('should return empty string for null or undefined input', () => {
      expect(getMask(null)).toBe('');
      expect(getMask(undefined)).toBe('');
    });

    it('should return empty string for unknown input type', () => {
      expect(getMask('UNKNOWN' as any)).toBe('');
    });
  });

  describe('getMaskFromFormat', () => {
    it('should return correct mask for MM/DD/YYYY', () => {
      expect(getMaskFromFormat('MM/DD/YYYY')).toBe('99/99/9999');
    });

    it('should return correct mask for DD/MM/YYYY', () => {
      expect(getMaskFromFormat('DD/MM/YYYY')).toBe('99/99/9999');
    });

    it('should return correct mask for YYYY-MM-DD', () => {
      expect(getMaskFromFormat('YYYY-MM-DD')).toBe('9999-99-99');
    });
  });
});
