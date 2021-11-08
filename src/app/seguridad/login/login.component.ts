import { Component, OnInit, HostListener, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";


import { User } from "src/app/entidades/user";
import { AuthService } from "src/app/services/auth.service";
import { StatusLogin } from "src/app/entidades/status-login";
import { TokenStorageService } from "src/app/shared-elements/services/token-storage.service";
import { ApplicationService } from 'src/app/shared-elements/services/application.service';
import { Utils } from 'src/app/shared-elements/utils/utils';
import { NoopScrollStrategy } from "@angular/cdk/overlay";
import { PopupForgetPasswordComponent } from 'src/app/shared-elements/components/popup-forget-password/popup-forget-password.component';
import { ConfigUserService } from "src/app/services/config-user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @Output() statusLogin = new EventEmitter();
  IstatusLogin: StatusLogin = { statusLogin: true, changePassword: false};

  myInnerHeight: number | undefined;
  myInnerHeightImg: number | undefined;
  myInnerHeightForm: number | undefined;
  myInnerWidth: number | undefined;
  myInnerWidthImg: number | undefined;
  myInnerWidthForm: number | undefined;

  form: User;
  isLoggedProccess = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];

  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  // evento ojo visualizar/no visualizar contraseña
  hide = false;

  constructor(
    public utils: Utils,
    public configUserService: ConfigUserService,
    private authService: AuthService,
    public tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private appService: ApplicationService,
    private dialog: MatDialog,
  ) {
    this.form = new User();
  }
  ngAfterViewInit(): void {
    if(this.tokenStorage.isLoggin()){
      this.router.navigate(['/home']);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.setSize(event.target.innerWidth, event.target.innerHeight);
  }

  ngOnInit() {
    this.tokenStorage.IstatusLoginObservable$.subscribe(
      (session: StatusLogin) => {
        this.IstatusLogin = session;
      },
      (error) => {
        console.log("Error en el seguimiento de la session");
      }
    );

    // NOTA: Hay que evaluar uso en el flujo actual de login
    this.setSize(window.innerWidth, window.innerHeight);
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
    }
    // NOTA: Hay que evalar uso de este id
    const id = this.route.snapshot.paramMap.get("id");
    // si estas logueado, no puedes dirigirte al path de login
    // Nota: Funcion actual pasa a deprecade, hay validar incorporacion
    // al nuevo flujo

    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['/home']);
  }

  setSize(width: number, height: number) {
    this.myInnerWidth = width;
    this.myInnerHeight = height;
    this.setWidth();
    this.setHeight();
  }

  setWidth() {
    if (this.myInnerWidth! < 700) {
      this.myInnerWidthImg = 0;
      this.myInnerWidthForm = this.myInnerWidth;
    } else {
      //this.myInnerWidthImg = this.myInnerWidth * 0.8;
      //this.myInnerWidthForm = this.myInnerWidth * 0.3;
      this.myInnerWidthImg = this.myInnerWidth! * 0.7;
      this.myInnerWidthForm = this.myInnerWidth! * 0.4;
    }
  }

  setHeight() {
    this.myInnerHeightImg = this.myInnerHeight;
    this.myInnerHeightForm = this.myInnerHeight;
  }

  putStyle(){
    let styles = {
      'width': 'calc(100vw - ' + this.myInnerWidthForm + 'px)',
    };

    return styles;
  }

  onSubmit_old() {
    this.isLoggedProccess = true;
    this.isLoginFailed = false;

    //NOTA: Se Evalua que ambos input (username and passowoed) no esten vacio.
    //evitar error critico antes de enviar al servicio
    if (this.validEraseInput(this.form)) {
      this.authService.login(this.form).subscribe(
        (data) => {
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data.user);

          // NOTA: Se debe filtar los metodos de acuerdo logica funcional (PENDIENTE_POR_REALIZAR)
          this.roles = this.tokenStorage.getUser().listRols;
          this.validChangePassword();

          this.hiddenFlag();

          // cargar listados
          this.getLoadListadosUtils();
        },
        (err) => {
          //NOTA:Hay que implementar un Handler para los mensajes de error.
          this.errorMessage = err.error.message == undefined ? err.message : err.error.message;

          if(err.error.code === 'EUB'){//Nota: Verificar si algunos errores se pueden manejar por codigos de error
            this.cleanFieldsWhenIsUserBlocked();
          } else{
            this.showFlagError();
          }
        }
      );
    } else {
      //NOTA: Se debe definir un menjase adecuado el se coloca es provicional
      this.errorMessage = "El Usuario y Contraseña no deben estar vacíos.";
      this.showFlagError();
    }
  }

  onSubmit() {
    this.isLoggedProccess = true;
    this.isLoginFailed = false;
    this.errorMessage = "";


    if(this.utils.isEmpty(this.form.username!) && this.utils.isEmpty(this.form.password)){
      this.errorMessage = "El Usuario y Contraseña no deben estar vacíos.";
      this.showFlagError();
      return "";
    }

    if(this.utils.isEmpty(this.form.username!)){
      this.isLoggedProccess = false;
      this.isLoginFailed = true;
      this.errorMessage = "El Usuario NO debe estar vacío.";
      return "";
    }

    if(!this.utils.isEmpty(this.form.username!) && this.utils.isEmpty(this.form.password)){

      this.authService.forgotPassword(this.form.username!, this.FORGET_PASSWORD_ACTION_INGRESAR)
      .subscribe(response => {
        if(response.code===this.CODE_EMAIL_EXIST){
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = "La Contraseña no debe estar vacía.";
        } else if(response.code===this.CODE_ERROR_VALOR_ACTION_NOT_FOUND) {
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = response.message;
        } else if(response.code===this.CODE_ERROR_USUARIO_NOT_FOUND) {
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = response.message;
        } else if(response.code===this.CODE_REGISTER_EMAIL_OF_USER_PENDING) {
          this.hiddenFlag();
          const dialogRef = this.dialog.open(PopupForgetPasswordComponent, {
            width: "650px",
            disableClose: true,
            scrollStrategy: new NoopScrollStrategy()
          });
          dialogRef.componentInstance.title = this.TITLE;
          dialogRef.componentInstance.subTitle = "Registro de correo electrónico";
          dialogRef.componentInstance.user = this.form.username as string;
          dialogRef.componentInstance.fieldOne = "Email ";
          dialogRef.componentInstance.fieldTwo = "Confirmar Email";

          dialogRef.afterClosed().subscribe(response => {
            if(response === undefined){
              return "";
            }
            if(response === null){
              return "";
            }
            else if(this.CODE_MAIL_SEND === response.code){
              this.errorMessage = "";
              return this.utils.toastSuccess(response.message);
            } else{
              return this.errorMessage = response.message;
            }
          });

        } else {
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = "¡La Acción enviada para esta funcionalidad NO es valida!";
        }
      });
      return "";
    }

    const formToSend: User = {...this.form};

    this.authService.loginToOAuth(formToSend).subscribe((oauth_data)=>{
      console.log('Aqui');
        // console.log("Datos");
        // console.log(JSON.stringify(oauth_data));


        //NOTA: Se Evalua que ambos input (username and passowoed) no esten vacio.
        //evitar error critico antes de enviar al servicio
        this.authService.login(formToSend).subscribe(
          (data) => {

            this.tokenStorage.saveToken(oauth_data.access_token);
            // this.tokenStorage.saveToken(oauth_data.access_token);
            this.tokenStorage.saveUser(data);

            // console.log(JSON.stringify(data));

            // NOTA: Se debe filtar los metodos de acuerdo logica funcional (PENDIENTE_POR_REALIZAR)
            this.roles = this.tokenStorage.getUser().listRols;

            /*
            console.log(data.registerDate);

            console.log(data.registerTime);

            let fecha = data.registerDate;
            let anio = fecha.substring(0,4);
            let mes = fecha.substring(4,6);
            let dia = fecha.substring(6,9);

            let tiempo = data.registerTime;
            let hora = tiempo.substring(0,2);
            let min = tiempo.substring(2,4);
            let seg = tiempo.substring(4,6);

            let y: number = +Number(mes)-1;
            console.log(data.registerDate);
            console.log(anio,Number(this.pad(y,2)),dia,hora,min,seg);
            let date: Date = new Date(anio,Number(this.pad(y,2)),dia,hora,min,seg);

            this.validresetPassword(date);

            */

            this.validChangePassword();



            this.hiddenFlag();

            // cargar listados
            this.getLoadListadosUtils();
          },
          (err) => {
            //NOTA:Hay que implementar un Handler para los mensajes de error.
            this.errorMessage = err.error.message == undefined ? err.message : err.error.message;
            if(err.error.code === 'EUB'){//Nota: Verificar si algunos errores se pueden manejar por codigos de error
              this.cleanFieldsWhenIsUserBlocked();
            } else{
              this.showFlagError();
            }
          }
        );

      },(error)=>{
        console.log("Error OAuth",error);

        //NOTA:Hay que implementar un Handler para los mensajes de error.
        this.errorMessage = error.error.error_description == undefined ? error.message : this.htmlEntities((error.error.error_description as string).split("#")[1]);
        if(error.error.error_description != undefined){
          if((error.error.error_description as string).split("#")[0] === 'EUB'){//Nota: Verificar si algunos errores se pueden manejar por codigos de error
            this.cleanFieldsWhenIsUserBlocked();
          } else {
            this.showFlagError();
          }
        } else {
          this.showFlagError();
        }
      }
    );


        // //NOTA: Se Evalua que ambos input (username and passowoed) no esten vacio.
        // //evitar error critico antes de enviar al servicio
        // this.authService.login(this.form).subscribe(
        //   (data) => {

        //     this.tokenStorage.saveToken(data.token);
        //     this.tokenStorage.saveUser(data.user);

        //     // console.log(JSON.stringify(data));

        //     // NOTA: Se debe filtar los metodos de acuerdo logica funcional (PENDIENTE_POR_REALIZAR)
        //     this.roles = this.tokenStorage.getUser().listRols;
        //     this.validChangePassword();

        //     this.hiddenFlag();

        //     // cargar listados
        //     this.getLoadListadosUtils();
        //   },
        //   (err) => {
        //     //NOTA:Hay que implementar un Handler para los mensajes de error.
        //     this.errorMessage = err.error.message == undefined ? err.message : err.error.message;
        //     if(err.error.code === 'EUB'){//Nota: Verificar si algunos errores se pueden manejar por codigos de error
        //       this.cleanFieldsWhenIsUserBlocked();
        //     } else{
        //       this.showFlagError();
        //     }
        //   }
        // );
        return;
  }

  hiddenFlag() {
    this.isLoginFailed = false;
    this.isLoggedProccess = false;
  }

  showFlagError() {
    this.isLoggedProccess = false;
    this.isLoginFailed = true;
    this.form.password = "";
  }

  cleanFieldsWhenIsUserBlocked(){
    this.showFlagError();
    this.form.username = null;
  }

  validEraseInput(varForm: User): boolean {
    return varForm.username == undefined ||
      varForm.username.trim().length == 0 ||
      varForm.password == undefined ||
      varForm.password.trim().length == 0
      ? false
      : true;
  }

  validresetPassword(datemod:Date){
    this.configUserService.getLastConfig().subscribe(
      (succes) => {
        let fecha = succes.modificationDate;
        let anio = fecha.substring(0,4);
        let mes = fecha.substring(4,6);
        let dia = fecha.substring(6,9);

        let y: number = +Number(mes)-1;

        let date: Date = new Date(Number(anio),Number(this.pad(y,2)),Number(dia),0,0,0);
        console.log(date);
        let datereset=this.addDays(date,succes.minimumForceChangePassword);
        let datecurrent: Date = new Date();


        console.log(datereset);
        console.log(datecurrent);
        console.log(datemod);

        console.log(datereset.getTime()+" <= "+datecurrent.getTime()+" "+succes.flagMinimumForceChangePassword+" "+ datemod.getTime()+" "+datereset.getTime());

        if(datereset.getTime() <= datecurrent.getTime() && succes.flagMinimumForceChangePassword=="1" && datemod.getTime()<datereset.getTime()){
          this.IstatusLogin.changePassword = true;
          this.tokenStorage.changePasswordSessionView();
        }

      },
      (error) => {
        console.log(error);

      }
    );
  }

  pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  addDays(date: Date, days: number): Date {
      date.setDate(date.getDate() + days);
      return date;
  }

  validChangePassword() {

    /*console.log(this.tokenStorage.getUser());

    let datecaducidad= Number(this.tokenStorage.getUser().periodoCaducidadContrasena);

    let today = new Date();

    var day = ('0' + today.getDate()).slice(-2);
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var year = today.getFullYear();

    let datecadatoday=Number(year+month+day)
    console.log(datecadatoday);
    console.log(datecaducidad);
    //datecadatoday>=datecaducidad
    if(datecadatoday>=datecaducidad){
      console.log("cambio");
      this.IstatusLogin.changePassword = true;
      this.tokenStorage.changePasswordSessionView();
    }else{*/
      if (
        this.tokenStorage.getUser().solicitarCambioContra == "1" ? true : false
      ) {
        this.IstatusLogin.changePassword = true;
        this.tokenStorage.changePasswordSessionView();
      } else {
        this.tokenStorage.openSessionView();
        this.router.navigateByUrl("/home");
      }
   /* }*/


  }

  openSnackBar() {
    this._snackBar.open("Operación realizada.", "HiperCenter", {
      duration: 700,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  getLoadListadosUtils() {
    this.appService.getApps().subscribe();
    this.appService.getChangeTypes().subscribe();
    this.appService.getMonedas().subscribe();
  }

  forgotPwd(){
    this.isLoggedProccess = true;
    this.isLoginFailed = false;
    this.errorMessage = "";

    if(this.utils.isEmpty(this.form.username!)){
      this.isLoggedProccess = false;
      this.isLoginFailed = true;
      this.errorMessage = "Ingresa el nombre de usuario.";
      return "";
    }

    this.authService.forgotPassword(this.form.username!, this.FORGET_PASSWORD_ACTION_OLVIDO_CONTRA)
      .subscribe(response => {
        console.log(response);
        if(response.code===this.CODE_ERROR_EMAIL_OF_USER_NOT_FOUND){
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = response.message;
        } else if(response.code===this.CODE_ERROR_USUARIO_NOT_FOUND) {
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = response.message;
        } else if(response.code===this.CODE_EMAIL_EXIST){
          console.log("email: ", response.message);
          this.isLoggedProccess=false;
          const dialogRef = this.dialog.open(PopupForgetPasswordComponent, {
            width: "650px",
            disableClose: true,
            scrollStrategy: new NoopScrollStrategy()
          });
          dialogRef.componentInstance.title = this.TITLE;
          dialogRef.componentInstance.subTitle = "Confirmación de correo electrónico";
          dialogRef.componentInstance.user = this.form.username as string;
          dialogRef.componentInstance.fieldOne = "Email ";
          dialogRef.componentInstance.fieldTwo = "Confirmar Email";
          dialogRef.componentInstance.fieldEmail = response.message;
          dialogRef.afterClosed().subscribe((response : any) => {
            console.log('response sendEmail: ', response);
            if(response === null){
              return "";
            }else if(this.CODE_MAIL_SEND === response.code){
              this.errorMessage = "";
              return this.utils.toastSuccess(response.message);
            } else{
              this.isLoginFailed = true;
              return this.errorMessage = response.message;
            }

          });
        } else if(response.code===this.CODE_ERROR_USER_LDAP){
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = response.message;
        }
        else{
          this.isLoggedProccess = false;
          this.isLoginFailed = true;
          this.errorMessage = "¡La Acción enviada para esta funcionalidad NO es valida!";
        }

      })
      return;
    }


    htmlEntities( str: string ):string {
      // return "";
      return str.replace('&ntilde;', 'ñ')
                        .replace('&Ntilde;', 'Ñ')
                        .replace('&amp;', '&')
                        .replace('&Ntilde;', 'Ñ')
                        .replace('&ntilde;', 'ñ')
                        .replace('&Ntilde;', 'Ñ')
                        .replace('&Agrave;', 'À')
                        .replace('&Aacute;', 'Á')
                        .replace('&Acirc;','Â')
                        .replace('&Atilde;','Ã')
                        .replace('&Auml;','Ä')
                        .replace('&Aring;','Å')
                        .replace('&AElig;','Æ')
                        .replace('&Ccedil;','Ç')
                        .replace('&Egrave;','È')
                        .replace('&Eacute;','É')
                        .replace('&Ecirc;', 'Ê')
                        .replace('&Euml;','Ë')
                        .replace(   '&Igrave;', 'Ì')
                        .replace('&Iacute;', 'Í'    )
                        .replace('&Icirc;', 'Î' )
                        .replace(   '&Iuml;', 'Ï')
                        .replace(   '&ETH;', 'Ð')
                        .replace(   '&Ntilde;', 'Ñ')
                        .replace(   '&Ograve;', 'Ò')
                        .replace(   '&Oacute;', 'Ó')
                        .replace('&Ocirc;', 'Ô' )
                        .replace(   '&Otilde;', 'Õ')
                        .replace('&Ouml;', 'Ö'  )
                        .replace('&Oslash;', 'Ø'    )
                        .replace(   '&Ugrave;' ,'Ù')
                        .replace(   '&Uacute;', 'Ú')
                        .replace(   '&Ucirc;', 'Û')
                        .replace(   '&Uuml;', 'Ü')
                        .replace(   '&Yacute;', 'Ý')
                        .replace('&THORN;', 'Þ' )
                        .replace(   '&szlig;', 'ß')
                        .replace(   '&agrave;', 'à')
                        .replace(   '&aacute;', 'á')
                        .replace(   '&acirc;', 'â')
                        .replace(   '&atilde;', 'ã')
                        .replace('&auml;', 'ä'  )
                        .replace(   '&aring;', 'å')
                        .replace(   '&aelig;', 'æ')
                        .replace(   '&ccedil;', 'ç')
                        .replace('&egrave;', 'è'    )
                        .replace('&eacute;', 'é'    )
                        .replace('&ecirc;', 'ê' )
                        .replace('&euml;', 'ë'  )
                        .replace(   '&igrave;', 'ì')
                        .replace('&iacute;', 'í'    )
                        .replace('&icirc;', 'î' )
                        .replace('&iuml;', 'ï'  )
                        .replace('&eth;', 'ð'   )
                        .replace(   '&ntilde;', 'ñ')
                        .replace('&ograve;','ò')
                        .replace('&oacute;','ó')
                        .replace('&ocirc;','ô')
                        .replace('&otilde;','õ')
                        .replace('&ouml;','ö')
                        .replace('&oslash;','ø')
                        .replace('&ugrave;','ù')
                        .replace('&uacute;','ú')
                        .replace('&ucirc;','û')
                        .replace('&uuml;' , 'ü')
                        .replace('&yacute;', 'ý')
                        .replace('&thorn;', 'þ')
                        .replace('&yuml;', 'ÿ');
    }


  TITLE = 'HiperCenter';

  CODE_EMAIL_EXIST:string = "EE";
  CODE_ERROR_USUARIO_NOT_FOUND:string="EUNE";
  CODE_ERROR_VALOR_ACTION_NOT_FOUND:string="EVANF";
  CODE_REGISTER_EMAIL_OF_USER_PENDING:string="REOUP";
  CODE_ERROR_USER_LDAP:string="EUL";


  CODE_ERROR_EMAIL_OF_USER_NOT_FOUND:string="EEOUNF";

  CODE_MAIL_SEND:string="MS";

  FORGET_PASSWORD_ACTION_INGRESAR:string = "1";
  FORGET_PASSWORD_ACTION_OLVIDO_CONTRA:string = "2";

  MSG_CONFIRM_EMAIL:string="Confirmación de correo electrónico";
  MSG_REGISTER_EMAIL:string="Registro de correo electrónico";
}
