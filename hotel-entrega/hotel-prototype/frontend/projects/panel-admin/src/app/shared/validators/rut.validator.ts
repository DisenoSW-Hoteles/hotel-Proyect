import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rutValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const rut = control.value.toString().replace(/\./g, '').replace(/-/g, '');
  if (rut.length < 8) return { invalidRut: true };

  const body = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedDv =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

  return dv === expectedDv ? null : { invalidRut: true };
}
