import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './seguridad/login/login.component';
import { PopupForgetPasswordComponent } from './shared-elements/components/popup-forget-password/popup-forget-password.component';
import { CambiarContrasenaComponent } from './seguridad/cambiar-contrasena/cambiar-contrasena.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestComponent } from './seguridad/test/test.component';
import {MatIconModule} from '@angular/material/icon';
import { authInterceptorProviders } from './shared-elements/interceptors/auth-interceptor';
import { tokenInterceptorProviders } from './shared-elements/interceptors/auth.interceptors';

@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
    LoginComponent,
    PopupForgetPasswordComponent,
    CambiarContrasenaComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPasswordStrengthModule.forRoot(),
    HttpClientModule,
    MatIconModule
  ],
  providers: [
    authInterceptorProviders,
    tokenInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
