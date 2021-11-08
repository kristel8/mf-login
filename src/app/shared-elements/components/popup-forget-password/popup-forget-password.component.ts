import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HelperMessage } from 'src/app/shared-elements/entidades/helperMessage';
import { User } from 'src/app/entidades/user';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/shared-elements/utils/utils';


@Component({
  selector: 'app-popup-example',
  templateUrl: './popup-forget-password.component.html',
  styleUrls: ['./popup-forget-password.component.scss']
})
export class PopupForgetPasswordComponent implements OnInit {

  title:string | undefined;
  subTitle: string | undefined;
  user:string | undefined;

  fieldOne:string ="";
  fieldTwo:string="";

  fieldEmail:string="";

  /*email:string="";
  emailConfirm:string="";*/

  form: any = {};


  public errors: HelperMessage[] = [];
  public MSG_NONE: string = 'none';
  public MSG_EMAIL: string = 'email';
  public MSG_EMAIL_CONFIRM: string = 'email_confirm';

  limitCharacter = {
    email:50
  }

  public FORGET_PASSWORD_ACTION_INGRESAR:string = "1";
  public FORGET_PASSWORD_ACTION_OLVIDO_CONTRA:string = "2";

  public MSG_CONFIRM_EMAIL:string="Confirmación de correo electrónico";
  public MSG_REGISTER_EMAIL:string="Registro de correo electrónico";

  public isProccess:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<PopupForgetPasswordComponent>,
    public utils: Utils,
    private authService: AuthService
    ) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  callBack(): void {
    if(this.isRequestValid()){
      this.isProccess=true;
      let user = new User();
      user.username = this.user;
      let action= "";
      if(this.MSG_CONFIRM_EMAIL===this.subTitle){
        action =this.FORGET_PASSWORD_ACTION_OLVIDO_CONTRA;;
        user.email = this.fieldEmail;
      }

      if(this.MSG_REGISTER_EMAIL===this.subTitle){
        action = this.FORGET_PASSWORD_ACTION_INGRESAR;
        user.email = this.form.email;
      }

      this.authService.forgotPasswordMail(user, action)
        .subscribe(response => {
          this.isProccess=false;
          this.dialogRef.close(response);
        });
    }
  }

  isRequestValid(): boolean{
    this.errors=[];

    if(this.isEmptyField()){
      if(this.isEmpty(this.form.email))
        this.errors.push({ name: this.MSG_EMAIL, message: "El campo Email se encuentra vacío" });

      if(!this.utils.isEmailValid(this.form.email))
          this.errors.push({ name: this.MSG_EMAIL, message: "El Email NO es válido"});
    }

    if(this.isEmpty(this.form.emailConfirm))
      this.errors.push({ name: this.MSG_EMAIL_CONFIRM, message: "El campo confirmación de Email se encuentra vacío" });

    if(!this.utils.isEmailValid(this.form.emailConfirm))
      this.errors.push({ name: this.MSG_EMAIL_CONFIRM, message: "El Email NO es válido"});

    if(this.getMaskedEmail()!==null && this.fieldEmail!==this.form.emailConfirm)
      this.errors.push({ name: this.MSG_EMAIL_CONFIRM, message: "El Email NO coincide con el registrado"});

    return this.errors.length === 0;
  }

  getMessage(keyMessage: string): string {
    return this.errors.filter(
      (item: HelperMessage) =>
        item.name == keyMessage).length > 0 ? this.errors.filter((item: HelperMessage) => item.name == keyMessage
        )[0].message : this.MSG_NONE;
  }

  isEmpty(value:string):boolean{
    return value===undefined || value===null || value.trim() ==="";
  }

  isEmptyField(){
    if(!this.isEmpty(this.fieldEmail)){
      this.form.email = this.getMaskedEmail();
    }
    return this.isEmpty(this.fieldEmail);
  }

  getMaskedEmail(){
    if(this.isEmpty(this.fieldEmail)){
      return null;
    }else{
      let aEmail:Array<any> = this.fieldEmail.split('@');
      let emailPart2:Array<any> = aEmail[1].split('.');
      emailPart2.splice(0,1);
      return aEmail[0].substring(0,2).concat("***@****.").concat(emailPart2.join('.'));
      //return aEmail[0].substring(0,2).concat("***@****.").concat(emailPart2[1]);
    }
  }

}
