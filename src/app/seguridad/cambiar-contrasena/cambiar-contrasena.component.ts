import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../entidades/user';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/shared-elements/services/token-storage.service';
import { ConfigUserService } from 'src/app/services/config-user.service';
import { ConfigSegUser } from '../../entidades/config-seg-user';
import { Utils } from 'src/app/shared-elements/utils/utils';


@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss']
})
export class CambiarContrasenaComponent implements OnInit, OnDestroy {

  myInnerHeight!: number;
  myInnerHeightImg!: number;
  myInnerHeightForm!: number;
  myInnerWidth!: number;
  myInnerWidthImg!: number;
  myInnerWidthForm!: number;

  isLoggedIn:boolean = false;
  isLoginFailed:boolean = false;
  errorMessage:string = '';
  roles: string[] = [];

  userCurrent!: User;
  isSuccessful = false;
  isSignUpFailed = false;

  usuario: User = new User();

  isProcessSave = false;

  confirmPassw: any;

  config!: ConfigSegUser;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    public utils: Utils,
    private configService: ConfigUserService
    ) {
    this.confirmPassw = '';

    this.configService.getLastConfig().subscribe(
      (succes) => {
        this.config = succes as ConfigSegUser;
      },
      (error) => {
        this.utils.verificarCodigoError(error, this.router);
      }
    );

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setSize(event.target.innerWidth, event.target.innerHeight);
  }

  ngOnInit() {
    this.setSize(window.innerWidth, window.innerHeight);
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
    }

    sessionStorage.setItem('changePassword', 'true');
    const id = this.route.snapshot.paramMap.get('id');
  }

  setSize(width: number, height: number) {
    this.myInnerWidth = width;
    this.myInnerHeight = height;
    this.setWidth();
    this.setHeight();
  }

  setWidth() {
    if (this.myInnerWidth < 700) {
      this.myInnerWidthImg = 0;
      this.myInnerWidthForm = this.myInnerWidth;
    } else {
      this.myInnerWidthImg = this.myInnerWidth * 0.6;
      this.myInnerWidthForm = this.myInnerWidth * 0.4;
    }
  }

  setHeight() {
    this.myInnerHeightImg = this.myInnerHeight;
    this.myInnerHeightForm = this.myInnerHeight;
  }

  guardar(form: NgForm) {
    this.isLoginFailed = false;
    let resuls: boolean = true;
    if (form.invalid) {
      console.log('Formulario invalido!!');
      this.errorMessage = "Los campos no se deben estar vacios";
      this.isLoginFailed = true;
      return;
    } else if (this.usuario.password != this.confirmPassw) {
      console.log('Las credenciales no coinciden');
      this.errorMessage = "Las credenciales no coinciden";
      this.isLoginFailed = true;
    } else if(Utils.validarLongitudContrasena(
          this.config.minMaxPasswordLengthAllowed,
          this.usuario.password,
          this.config.maxPasswordLengthAllowed,
          this.config.minPasswordLengthAllowed)){
      this.errorMessage = "No se cumple la longitud (" + this.config.minPasswordLengthAllowed + "-" + this.config.maxPasswordLengthAllowed + ") de contraseña";
      this.isLoginFailed = true;
    } else if(Utils.validarNumeroCaracteresRepetidos(
          this.config.flagValidateNumberMaxRepeat,
          this.usuario.password,
          this.config.numberMaxRepeat)) {
      this.errorMessage = "Número de caracteres repetidos excedidos";
      this.isLoginFailed = true;
    } else if(Utils.validarLimiteDigitosAdyacentesv2(
      this.config.flagValidateDigitPassword,
      this.usuario.password
    )) {
      this.errorMessage =  "No debe tener dígitos adyacentes";
      this.isLoginFailed = true;
    } else if (this.usuario.password == this.confirmPassw) {
      let messangeRuleCaracter_PWT:string = "";
      if (Utils.validarCaractererNumerico(
        this.config.flagValidatePasswordCharacters,
        this.usuario.password)) {
          messangeRuleCaracter_PWT = "un número, ";
          resuls=false;
      }
      if (Utils.validarCaractererMinuscula(
        this.config.flagValidatePasswordCharacters,
        this.usuario.password)) {
        messangeRuleCaracter_PWT = messangeRuleCaracter_PWT + "una minúscula, ";
        resuls=false;
      }
      if (Utils.validarCaractererMayuscula(
        this.config.flagValidatePasswordCharacters,
        this.usuario.password)) {
          messangeRuleCaracter_PWT = messangeRuleCaracter_PWT + "una mayúscula, ";
          resuls=false;
      }
      if (Utils.validarCaracteresEspeciales(
        this.config.flagValidateSpecialPassword,
        this.usuario.password)) {
        messangeRuleCaracter_PWT = messangeRuleCaracter_PWT + "un caracter especial, ";
        resuls=false;
      }

      if (!resuls){
        let messageResult:string = "La contraseña debe tener "+messangeRuleCaracter_PWT+".";
        this.errorMessage = messageResult.replace(", .",".")
        this.isLoginFailed = true;
      }

      if(!this.isLoginFailed){
        this.userCurrent = this.tokenStorageService.getUser();
        // se asigna el id
        this.userCurrent.solicitarCambioContra = '0';
        this.userCurrent.password = this.usuario.password;
        this.isProcessSave= true;
        this.userCurrent.flagDefecPassword = '0';
        this.userService.update(this.userCurrent).subscribe(
          data => {
            console.log('Correcto - Cambio de contraseña');
            this.isSuccessful = true;
            this.isLoggedIn = true;
            this.tokenStorageService.signOut();
            this.tokenStorageService.closeSessionView();
            //this.router.navigate(['/login']);
            this.isProcessSave= false;
          },
          (error) => {
            this.isSignUpFailed = true;
            this.errorMessage = error.error.message == undefined ? error.message : error.error.message;
            this.isLoginFailed = true;
            this.isProcessSave= false;
            console.log('error ');
          }
        );
      }

    }
  }

  onNoClick(): void {
    this.tokenStorageService.closeSessionView();
    this.tokenStorageService.signOut();
    //this.router.navigate(['/login']);
  }

  reloadPage() {
    window.location.reload();
  }

  ngOnDestroy() {
    // this.reloadPage();
  }

}
