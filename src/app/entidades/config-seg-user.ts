
export class ConfigSegUser {
	id: string | undefined; // codigo de la configuracion
	numberFailedAttempts!: number; // Número máxmimo de intentos fallidos permitidos
 // Número máxmimo de intentos fallidos permitidos
	flagNumberFailedAttempts!: string; // flag que indica si validar el número de intentos fallidos
 // flag que indica si validar el número de intentos fallidos
	blockUserInactivityPeriod!: number; // valor en días para bloquear un usuario por inactividad
 // valor en días para bloquear un usuario por inactividad
	flagBlockUserInactivityPeriod!: string; // flag que indica si se valida el bloqueo de cuenta por inactividad
 // flag que indica si se valida el bloqueo de cuenta por inactividad
	minimumForceChangePassword!: number; // valor en días para forzar el cambio de contraseña
 // valor en días para forzar el cambio de contraseña
	flagMinimumForceChangePassword!: string; // flag que indica si se valida el minimumForceChangePassword
 // flag que indica si se valida el minimumForceChangePassword
	minPasswordLengthAllowed!: number; // longitud minima de contraseña
 // longitud minima de contraseña
	maxPasswordLengthAllowed!: number; // longitud maxima de contraseña
 // longitud maxima de contraseña
	minMaxPasswordLengthAllowed!: string; // flag que indica si se valida la longitud maxima y minima
 // flag que indica si se valida la longitud maxima y minima
	numberOfPasswordHistory!: number; // número de contraseñas anteriores para no ser usuadas tras un nuevo cambio de contraseña
 // número de contraseñas anteriores para no ser usuadas tras un nuevo cambio de contraseña
	modificationDate!: string;
	modificationTime!: string;
	flagValidateNumberPasswordHistory!: string; // flag que indica si se valida numberOfPasswordHistory
 // flag que indica si se valida numberOfPasswordHistory
	storeDefaultPassword!: string; // contraseña por defecto a usar
 // contraseña por defecto a usar
	flagPasswordHistory!: string; // flag que indica sí se guarda un historial de contraseñas siempre tener en 1
 // flag que indica sí se guarda un historial de contraseñas siempre tener en 1
	flagValidatePasswordCharacters!: string; // flag que indica si se valida el ingreso de caracteres en el password
 // flag que indica si se valida el ingreso de caracteres en el password
	flagValidateDigitPassword!: string; // flag que indica si se valida digitos adyacentes en el password
 // flag que indica si se valida digitos adyacentes en el password
	flagValidateSpecialPassword!: string; // flag que indica si se valida caracteres especiales en el password
 // flag que indica si se valida caracteres especiales en el password
	modificationUserCode!: string;
	flagValidateNumberMaxRepeat!: string; // flag que indica sí se valida caracteres repetidos
 // flag que indica sí se valida caracteres repetidos
	numberMaxRepeat!: number; // numero maximo de caracteres repetidos
 // numero maximo de caracteres repetidos
	flagUserBlockFailedAttempts!: string; // bloqeuo de usuario por intentos fallidso
 // bloqeuo de usuario por intentos fallidso
	timeUnlockAccountFailedAttempts!: string; // hora para desbloquear usuario por intentos fallidos
 // hora para desbloquear usuario por intentos fallidos
	minuteUnlockAccountFailedAttempts!: string; // minutos para desbloquear usuario por intentos fallidos
 // minutos para desbloquear usuario por intentos fallidos
	flagUserPasswordDefault!: string; // flag usuario con contraseña por defecto
 // flag usuario con contraseña por defecto
	flagUserPasswordDefaultUserAccount!: string; // flag cuenta por defecto igual a cuenta
 // flag cuenta por defecto igual a cuenta
}
