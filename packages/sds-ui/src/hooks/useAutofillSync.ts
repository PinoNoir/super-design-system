import { useEffect } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';

function useAutofillSync<T extends Record<string, any>>(formMethods: UseFormReturn<T>) {
  useEffect(() => {
    const interval = setInterval(() => {
      const form = document.querySelector('form');
      if (!form) return;

      const inputs = form.querySelectorAll<HTMLInputElement>('input[name]');
      const currentValues = formMethods.getValues(); // Get all values once

      inputs.forEach((input) => {
        const name = input.name as Path<T>;

        if (!(name in currentValues)) return;

        const currentValue = currentValues[name];
        const inputValue = input.value;

        if (inputValue !== currentValue) {
          formMethods.setValue(name, inputValue as any, { shouldValidate: true });
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [formMethods]);
}

export default useAutofillSync;
