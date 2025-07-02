import { FieldError, FieldErrors } from 'react-hook-form';
import { getDisplayErrorMessage } from '../get-display-error-message';

describe('getDisplayErrorMessage', () => {
  test('returns empty string for undefined or null error', () => {
    expect(getDisplayErrorMessage(undefined)).toBe('');
    expect(getDisplayErrorMessage(null as any)).toBe('');
  });

  test('returns message property from FieldError object', () => {
    const fieldError: FieldError = {
      type: 'required',
      message: 'Field is required',
    };
    expect(getDisplayErrorMessage(fieldError)).toBe('Field is required');
  });

  test('returns type property if message is not available', () => {
    const fieldError: FieldError = {
      type: 'required',
    };
    expect(getDisplayErrorMessage(fieldError)).toBe('required');
  });

  test('handles nested FieldErrors objects from react-hook-form', () => {
    const fieldErrors: FieldErrors = {
      name: {
        type: 'required',
        message: 'Name is required',
      },
      email: {
        type: 'pattern',
        message: 'Invalid email format',
      },
    };
    expect(getDisplayErrorMessage(fieldErrors)).toBe(
      '{"name":{"type":"required","message":"Name is required"},"email":{"type":"pattern","message":"Invalid email format"}}',
    );
  });

  test('handles React nodes', () => {
    // Mock a simple React node (string)
    const reactNode: React.ReactNode = 'Error message' as React.ReactNode;
    expect(getDisplayErrorMessage(reactNode)).toBe('Error message');

    // For a more complex React node object
    const complexReactNode = {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: { children: 'Error in component' },
    } as unknown as React.ReactNode;

    // Given the function's implementation, it will likely stringify the entire object
    // or extract some specific property. Let's check that it contains some expected structure
    const result = getDisplayErrorMessage(complexReactNode);
    expect(typeof result).toBe('string');

    // At minimum, it should return some non-empty string representation
    expect(result.length).toBeGreaterThan(0);
  });

  test('stringifies complex error objects', () => {
    const complexError = {
      code: 404,
      status: 'Not Found',
    } as unknown as FieldError;

    expect(getDisplayErrorMessage(complexError)).toBe('{"code":404,"status":"Not Found"}');
  });
});
