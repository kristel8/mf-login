import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilsTemp } from 'src/app/utils/utils-temp';
import { Menu } from '../entidades/menu';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // API DE MODULO
  private urlEndPoint: string = `${environment.urlGateway}${UtilsTemp.SEC_USER_WEB_MAIN}${UtilsTemp.SEC_MENU_PREFIJO}`;


  constructor(private http: HttpClient) { }

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.urlEndPoint);
  }

  getById(id: string): Observable<Menu> {
    return this.http.get<Menu>(this.urlEndPoint + UtilsTemp.SEC_MENU_FIND_BY_ID + id);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete<any>(this.urlEndPoint + UtilsTemp.SEC_MENU_DELETE_BY_ID + id);
  }

  update(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(this.urlEndPoint , menu);
  }

  create(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.urlEndPoint , menu);
  }

}
