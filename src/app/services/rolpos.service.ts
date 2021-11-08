import { Injectable } from '@angular/core';
import { UtilsTemp } from 'src/app/utils/utils-temp';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolePos } from '../entidades/role-pos';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
    providedIn: 'root'
  })
export class RolPosService{

  private urlEndPoint: string = `${environment.urlGateway}${UtilsTemp.SEC_ROLPOS_PREFIJO}`;


  constructor(private _http: HttpClient,
             private authService: AuthService) { }

  getModulo(){
    return this._http.get(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_MODULO);
  }

  getAllRolePos(type: string) : Observable<RolePos[]>{
    return this._http.get<RolePos[]>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL + UtilsTemp.SEC_ROLPOS_FIND_ALL + type +  "?app="+ this.authService.app);
  }

  getById(id: string): Observable<RolePos> {
    return this._http.get<RolePos>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL + UtilsTemp.SEC_ROLPOS_FIND_BY_ID + id);
  }

  update(rol: RolePos): Observable<RolePos> {
    return this._http.put<RolePos>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL, rol);
  }

  create(currentRol: RolePos): Observable<RolePos> {
    return this._http.post<RolePos>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL , currentRol);
  }

  checkDuplicates(rol: RolePos): Observable<any> {
    return this._http.post(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL + UtilsTemp.CHECK_DUPLICATES, rol);
  }

  deleteRolBy(id: string){
    return this._http.delete<RolePos>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_ROL + UtilsTemp.SEC_ROL_DELETE_BY_ID+ id)
  }


  countRoleAsUser(id: string): Observable<any> {
    console.log("Ruta: "+this.urlEndPoint + UtilsTemp.SEC_ROLPOS_PREFIJO + UtilsTemp.SEC_ROLPOS_DELETE_COUNT + id);
    return this._http.get<any>(this.urlEndPoint + UtilsTemp.SEC_ROLPOS_PREFIJO + UtilsTemp.SEC_ROLPOS_DELETE_COUNT + id);
  }

  // getAllRolPos(): Observable<User[]>{
  //   return this.http.get<User[]>(`${this.apiOperator}`);
  // }

  // getAllCR(): Observable<MenuTree[]> {
  //   return this._http.get<MenuTree[]>(`${this.urlModulo}/I71`);
  // }

  // getAllCJCONI(): Observable<MenuTree[]> {
  //   return this._http.get<MenuTree[]>(`${this.urlModulo}/I72`);
  // }
    //PErfiles coemrcio
    // getAllProfile(): Observable<MerchantProfile[]> {
    //   return this._http.get<MerchantProfile[]>(this.urlEndPoint + UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_MAIN);
    // }

    //grupo de tarjeta
    // getAllGrupoTarjeta(): Observable<GrupoTarjeta[]> {
    //   return this._http.get<GrupoTarjeta[]>(this.urlEndPoint + UtilsTemp.SEC_GROUD_CARD_PREFIJO);
    // }

}
