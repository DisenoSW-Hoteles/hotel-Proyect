import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaCheckInNoPasada(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const seleccionada = new Date(control.value);
    seleccionada.setHours(0, 0, 0, 0);
    return seleccionada >= hoy
      ? null
      : { fechaPasada: 'El check-in no puede ser una fecha pasada.' };
  };
}

export function fechasValidator(group: AbstractControl): ValidationErrors | null {
  const checkIn = group.get('fechaCheckIn')?.value;
  const checkOut = group.get('fechaCheckOut')?.value;
  if (!checkIn || !checkOut) return null;

  const fechaIn = new Date(checkIn);
  fechaIn.setHours(0, 0, 0, 0);
  const fechaOut = new Date(checkOut);
  fechaOut.setHours(0, 0, 0, 0);

  const checkOutCtrl = group.get('fechaCheckOut');

  if (fechaOut <= fechaIn) {
    checkOutCtrl?.setErrors({ ...(checkOutCtrl?.errors ?? {}), fechaPosterior: true });
    return { fechaPosterior: true };
  }

  if (checkOutCtrl?.hasError('fechaPosterior')) {
    const errs = { ...checkOutCtrl.errors };
    delete errs['fechaPosterior'];
    checkOutCtrl.setErrors(Object.keys(errs).length ? errs : null);
  }

  return null;
}
