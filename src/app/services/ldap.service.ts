import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsTemp } from 'src/app/shared-elements/utils/utils-temp';
import { Observable } from 'rxjs';
import { LdapConfiguration } from '../entidades/ldap-configuration';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LdapService {

  private urlEndPoint: string = `${environment.urlGateway}${UtilsTemp.SEC_USER_WEB_MAIN}${UtilsTemp.SEC_LDAP_PREFIJO}`;

    constructor(private http: HttpClient) { }

    list(): Observable<LdapConfiguration[]> {
        return this.http.get<LdapConfiguration[]>(this.urlEndPoint);
    }

    create(data: LdapConfiguration): Observable<LdapConfiguration> {
        return this.http.post<LdapConfiguration>(this.urlEndPoint, data);
    }

    update(data: LdapConfiguration): Observable<LdapConfiguration> {
        return this.http.put<LdapConfiguration>(this.urlEndPoint, data);
    }

    deleteMany(data: LdapConfiguration[]): Observable<any> {
        return this.http.post<any>(this.urlEndPoint + UtilsTemp.SEC_LDAP_DELETE_MANY, data);
    }

}
