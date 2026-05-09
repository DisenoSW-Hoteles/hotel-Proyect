import { AbstractControl, ValidationErrors } from '@angular/forms';

export function clpMultipleOf1000Validator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (value != null && value % 1000 !== 0) {
    return { notMultipleOf1000: true };
  }
  return null;
}
