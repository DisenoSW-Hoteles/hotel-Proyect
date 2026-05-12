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
  const checkInCtrl = group.get('fechaCheckIn');
  const checkOutCtrl = group.get('fechaCheckOut');
  const checkIn = checkInCtrl?.value;
  const checkOut = checkOutCtrl?.value;

  if (!checkIn || !checkOut) return null;

  const fechaIn = new Date(checkIn);
  fechaIn.setHours(0, 0, 0, 0);
  const fechaOut = new Date(checkOut);
  fechaOut.setHours(0, 0, 0, 0);

  if (fechaOut <= fechaIn) {
    checkOutCtrl?.setErrors({ ...checkOutCtrl.errors, fechaPosterior: 'El check-out debe ser posterior al check-in.' });
    return { fechaPosterior: true };
  }

  const currentErrors = checkOutCtrl?.errors ?? {};
  delete currentErrors['fechaPosterior'];
  checkOutCtrl?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);

  return null;
}
