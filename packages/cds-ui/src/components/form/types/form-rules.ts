// Rule use for Registration Validation on Controls.
// These are the basic validators that can be used with or instead of Zod.
export interface Rule {
  value: boolean | string | number | RegExp | ((value: any) => boolean | string);
  errorMessage: string;
}

// This is the allowed built in validation rules for the form controls.
// Anothing more complex than this needs to use ZOD for validation.
export interface Rules {
  required?: Rule;
  minlength?: Rule;
  maxlength?: Rule;
  min?: Rule;
  max?: Rule;
  pattern?: Rule;
  validate?: Rule;
}
