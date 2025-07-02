import { detectCCType } from '../cc-utils';

describe('Credit Card Type Detection', () => {
  describe('Visa Detection', () => {
    const visaTestCases = [
      '4111111111111111',
      '4012888888881881',
      '4222222222222',
      '4 1111 1111 1111 1111',
      '4-1111-1111-1111-1111',
    ];

    visaTestCases.forEach((cardNumber) => {
      it(`should detect Visa for card number: ${cardNumber}`, () => {
        expect(detectCCType(cardNumber)).toBe('visa');
      });
    });
  });

  describe('Mastercard Detection', () => {
    const mastercardTestCases = [
      '5500000000000004',
      '5555555555554444',
      '5105105105105100',
      '51 0510 5105 1051 00',
      '51-0510-5105-1051-00',
    ];

    mastercardTestCases.forEach((cardNumber) => {
      it(`should detect Mastercard for card number: ${cardNumber}`, () => {
        expect(detectCCType(cardNumber)).toBe('mastercard');
      });
    });
  });

  describe('American Express Detection', () => {
    const amexTestCases = [
      '340000000000009',
      '378282246310005',
      '371449635398431',
      '34 0000 0000 0009',
      '37-8282-2463-10005',
    ];

    amexTestCases.forEach((cardNumber) => {
      it(`should detect Amex for card number: ${cardNumber}`, () => {
        expect(detectCCType(cardNumber)).toBe('amex');
      });
    });
  });

  describe('Discover Detection', () => {
    const discoverTestCases = [
      '6011111111111117',
      '6011000990139424',
      '6500000000000002',
      '6011 1111 1111 1117',
      '65-0000-0000-0002',
    ];

    discoverTestCases.forEach((cardNumber) => {
      it(`should detect Discover for card number: ${cardNumber}`, () => {
        expect(detectCCType(cardNumber)).toBe('discover');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return unknown for empty string', () => {
      expect(detectCCType('')).toBe('unknown');
    });

    it('should return unknown for null', () => {
      expect(detectCCType(null as any)).toBe('unknown');
    });

    it('should return unknown for undefined', () => {
      expect(detectCCType(undefined as any)).toBe('unknown');
    });

    it('should handle input with non-digit characters', () => {
      expect(detectCCType('abc')).toBe('unknown');
    });

    it('should return unknown for unrecognized card types', () => {
      expect(detectCCType('1234567890123456')).toBe('unknown');
    });
  });

  describe('Whitespace and Formatting Handling', () => {
    it('should ignore spaces in card numbers', () => {
      expect(detectCCType('4111 1111 1111 1111')).toBe('visa');
    });

    it('should ignore dashes in card numbers', () => {
      expect(detectCCType('4111-1111-1111-1111')).toBe('visa');
    });

    it('should handle mixed formatting', () => {
      expect(detectCCType('4111-1111 1111-1111')).toBe('visa');
    });
  });
});
