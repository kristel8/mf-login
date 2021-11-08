import { Role } from './role';

export class User {

    id: string | undefined;
    firstName!: string;
    secondName!: string;
    username: string | undefined | null;
    password!: string;
    modifyUser!: string;
    registerDate!: string;
    registerTime!: string;
    ultimoInicioSesionDate!: string;
    ultimoInicioSesionTime!: string;
    numeroIntentosFallidos!: number;
    usuarioBloqueado: string;
    periodoCaducidadContrasena!: string;
    tipoDeEncriptacion!: string;
    tautentication!: string;
    periodoBloqueoIntentosFallidosDate!: string;
    periodoBloqueoIntentosFallidosTime!: string;
    solicitarCambioContra!: string;
    tipoUsuario!: string;
    flagDefecPassword!: string;
    email!: string;

    listRols!: Role[];
    optiomManc!: number[];

    constructor() {
        this.usuarioBloqueado = '0';
    }
}
