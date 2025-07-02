import { render, act } from '@testing-library/react';
import useAutofillSync from '../useAutofillSync';
import { UseFormReturn } from 'react-hook-form';

type FormData = {
  firstName: string;
};

const getValues = jest.fn();
const setValue = jest.fn();

const mockFormMethods = {
  getValues,
  setValue,
} as unknown as UseFormReturn<FormData>;

const TestComponent = () => {
  useAutofillSync<FormData>(mockFormMethods);

  return (
    <form>
      <input name="firstName" defaultValue="John" />
    </form>
  );
};

describe('useAutofillSync', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('syncs input value to form state if different', () => {
    getValues.mockReturnValue({ firstName: 'Jane' });

    render(<TestComponent />);

    const input = document.querySelector('input[name="firstName"]') as HTMLInputElement;
    input.value = 'John'; // Simulate autofill

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(setValue).toHaveBeenCalledWith('firstName', 'John', expect.objectContaining({ shouldValidate: true }));
  });

  it('does not call setValue if values match', () => {
    getValues.mockReturnValue({ firstName: 'John' });

    render(<TestComponent />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});
