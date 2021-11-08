import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UtilsTemp } from 'src/app/utils/utils-temp';
import { Role } from '../entidades/role';
import { CadenaComercio } from '../entidades/cadena-comercio';
import { GrupoTarjeta } from '../entidades/groupCard';
import { Application } from 'src/app/entidades/application';
import { AuthService } from './auth.service';
import { filter, find, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndPoint: string = `${environment.urlGateway}${UtilsTemp.SEC_USER_WEB_MAIN}`;


  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAll(type: string): Observable<Role[]> {
    return this.http.get<Role[]>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.SEC_ROL_FIND_ALL + type + "?app=" + this.authService.app);
  }

  getById(id: string): Observable<Role> {
    return this.http.get<Role>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.SEC_ROL_FIND_BY_ID + id);
  }

  update(rol: Role): Observable<Role> {
    return this.http.put<Role>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO, rol);
  }

  create(rol: Role): Observable<Role> {
    return this.http.post<Role>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO, rol);
  }

  checkDuplicates(rol: Role): Observable<any> {
    return this.http.post(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.CHECK_DUPLICATES, rol);
  }

  deleteMany(roles: Role[]): Observable<any> {
    return this.http.post<any>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.SEC_ROL_DELETE_MANY, roles);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete<any>(this.urlEndPoint + UtilsTemp.SEC_ROL_DELETE_BY_ID + id);
  }

  countRoleAsUser(id: string): Observable<any> {
    console.log("Ruta: " + this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.SEC_ROL_DELETE_COUNT + id);
    return this.http.get<any>(this.urlEndPoint + UtilsTemp.SEC_ROL_PREFIJO + UtilsTemp.SEC_ROL_DELETE_COUNT + id);
  }

  //grupo de tarjeta
  getAllGrupoTarjeta(): Observable<GrupoTarjeta[]> {
    return this.http.get<GrupoTarjeta[]>(this.urlEndPoint + UtilsTemp.SEC_GROUD_CARD_PREFIJO).pipe(
      map(data => data.filter(item => {
        if (this.authService.app === '0') {
          return true;
        }

        if (this.authService.app === item.cgrAplicacion) {
          return true;
        } else {
          return false;
        }
      }))
    )
  }

}
