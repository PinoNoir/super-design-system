import { RegisterOptions } from 'react-hook-form';
import { Rules } from '../types/form-rules';

// Converts the inline Rules to the Form Validation Rules
export const buildValidationRules = (rules: Rules[]): RegisterOptions => {
  const validationRules: RegisterOptions = {};

  rules.forEach((rule) => {
    if (rule.required) {
      validationRules.required = {
        value: rule.required.value as boolean,
        message: rule.required.errorMessage,
      };
    }
    if (rule.min) {
      validationRules.minLength = {
        value: rule.min.value as number,
        message: rule.min.errorMessage,
      };
    }
    if (rule.max) {
      validationRules.maxLength = {
        value: rule.max.value as number,
        message: rule.max.errorMessage,
      };
    }
    if (rule.minlength) {
      validationRules.minLength = {
        value: rule.minlength.value as number,
        message: rule.minlength.errorMessage,
      };
    }
    if (rule.maxlength) {
      validationRules.maxLength = {
        value: rule.maxlength.value as number,
        message: rule.maxlength.errorMessage,
      };
    }
    if (rule.pattern) {
      validationRules.pattern = {
        value: rule.pattern.value as RegExp,
        message: rule.pattern.errorMessage,
      };
    }
    if (rule.validate) {
      validationRules.validate = {
        value: rule.validate.value as (value: any) => boolean | string,
      };
    }
  });

  return validationRules;
};
