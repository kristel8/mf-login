import { TransactionType } from 'src/app/entidades/transaction-type';
// import { MerchantProfileApplication } from './merchant-profile-application';
import { FloorLimit } from '../../configuracion-red/entidades/floor-limit';
// import { MerchantProfileApplication } from '../../configuracion-red/entidades/merchant-profile-application';
import { RolPosApplication } from './rol-pos-application';
import { Menu } from './menu';
import { SubMenu } from './sub-menu';
// import { FloorLimit } from './floor-limit';

export class InnerComponent {
  private rolPosApplication: Menu;

  listTransactionType: TransactionType[];
  selectItems = [];
  selectItemInit = [];

  id: string;
  description: string;
  identifier: string;
  icon: string;
  type: string;
  modificationUserCode: string;
  modificationDate: string;
  modificationTime: string;
  merchantChainIndicator: string;
  groupCardIndicator: string;
  // flagMultimoneda: boolean;
  // flagCuatroUlDigitos: boolean;
  // flagSolicitarDNI: boolean;
  // flagCashBack: boolean;
  // flagMultiproducto: boolean;

  // valueDigitacionTarjeta: string;
  // valueTipoCierre: string;
  // valueTrxDefault: string;
  // valueIngresoTarejta: string;

  // flagHoraAtencion: boolean;
  // valueHoraInicio: string;
  // valueMinutoInicio: string;
  // valueHoraFin: string;
  // valueMinutoFin: string;

  // flagAlarmaMontoMinimo: boolean;
  // valueMontoMonedaLocal: string;
  // valueMontoMonedaExtranjera: string;
  // flagAlarmaSMS: boolean;
  // flagAlamarEmail: boolean;

  show: boolean = false;

  constructor(listTransactionType: TransactionType[], rolPosApplication: Menu) {
    this.listTransactionType = listTransactionType;
    this.initValuesParteUno();
    // this.initValuesComboBox();
    // this.initValuesParteDos();
    // this.initValuesParteTres();
    if (rolPosApplication != undefined) {
      this.rolPosApplication = rolPosApplication;
      this.getTrxSelectInit();
      this.loadValues();
    } else {
      this.rolPosApplication = new Menu();
    }
    this.show = true;
  }

  initValuesParteUno() {
    this.id = '';
  //   this.flagCuatroUlDigitos = false;
  //   this.flagSolicitarDNI = false;
  //   this.flagCashBack = false;
  //   this.flagMultiproducto = false;

  //   this.valueDigitacionTarjeta = '';
  //   this.valueTipoCierre = '';
  //   this.valueTrxDefault = '';
  //   this.valueIngresoTarejta = '';
  }

  // initValuesComboBox() {
  //   this.valueDigitacionTarjeta = '';
  //   this.valueTipoCierre = '';
  //   this.valueTrxDefault = '';
  //   this.valueIngresoTarejta = '';
  // }

  // initValuesParteDos() {
  //   this.flagHoraAtencion = false;
  //   this.valueHoraInicio = '00';
  //   this.valueMinutoInicio = '00';
  //   this.valueHoraFin = '00';
  //   this.valueMinutoFin = '00';
  // }

  // initValuesParteTres() {
  //   this.flagAlarmaMontoMinimo = false;
  //   this.valueMontoMonedaLocal = '0.00';
  //   this.valueMontoMonedaExtranjera = '0.00';
  //   this.flagAlarmaSMS = false;
  //   this.flagAlamarEmail = false;
  // }

  processDataOutPut(array: any[]) {
    this.selectItems = array;
  }

  loadDataInit(array: any[]) {
    this.selectItemInit = array;
    //this.selectItems = array;
  }

  getOutPutData(userCode: string, posID: string, aplicationID: string): any {
    this.getRolPosApplication(userCode, posID, aplicationID);
    this.rolPosApplication.listArbolModulo = this.getTransactionSelect(userCode, posID, aplicationID);
    return this.rolPosApplication;
  }

  private getRolPosApplication(userCode: string, posID: string, aplicationID: string) {
    this.rolPosApplication.id = posID;
    this.rolPosApplication.identifier = aplicationID;

    // this.rolPosApplication.id = this.getValueFromString(this.id);
    // this.rolPosApplication.cmareqLastNumber = this.getValueFromBoolean(this.flagCuatroUlDigitos);
    // this.rolPosApplication.cmareqDocId = this.getValueFromBoolean(this.flagSolicitarDNI);
    // this.rolPosApplication.cmareqCashBack = this.getValueFromBoolean(this.flagCashBack);
    // this.rolPosApplication.cmamultiproduct = this.getValueFromBoolean(this.flagMultiproducto);

    // this.rolPosApplication.cmacardWriter = this.valueDigitacionTarjeta;
    // this.rolPosApplication.cmacloseType = this.valueTipoCierre;
    // this.rolPosApplication.cmatrxDefault = this.valueTrxDefault;
    // this.rolPosApplication.cmaconfirmCardEntryMode = this.valueIngresoTarejta;

    // this.rolPosApplication.cmareqHourOperation = this.getValueFromBoolean(this.flagHoraAtencion);
    // this.rolPosApplication.cmahourOperationFrom = this.valueHoraInicio + this.valueMinutoInicio;
    // this.rolPosApplication.cmahourOperationTo = this.valueHoraFin + this.valueMinutoFin;

    // this.rolPosApplication.cmareqMinimumAmount = this.getValueFromBoolean(this.flagAlarmaMontoMinimo);
    // this.rolPosApplication.nmaminAmountLocal = this.valueMontoMonedaLocal;
    // this.rolPosApplication.cmareqAlarmSMS = this.getValueFromBoolean(this.flagAlarmaSMS);
    // this.rolPosApplication.cmareqAlarmEmail = this.getValueFromBoolean(this.flagAlamarEmail);

    this.rolPosApplication.modificationUserCode = userCode;
  }

  private getTransactionSelect(userCode: string, posID: string, aplicationID: string): SubMenu[] {
    const listFloorLimit: SubMenu[] = [];
    this.selectItems.forEach(
      (trx: TransactionType) => {
        const floorLimit = new SubMenu();
        floorLimit.idModulo = posID;
        floorLimit.idProcess = trx.ctttransactionId;
        floorLimit.procesoIndicator = trx.dtttransactionName;
        floorLimit.processName = trx.dttdescription;
        floorLimit.parenProcessCode = null;
        floorLimit.processNivel = trx.ctttransGroup;
        floorLimit.registerStatus = trx.ctttransGroup;
        floorLimit.processIcon = null;
        floorLimit.modificationUserCode = null;
        floorLimit.processFile = trx.ctttransGroup;
        floorLimit.modificationDate = null;
        floorLimit.modificationTime = null;
        floorLimit.flagProtectedAccess = '0';
        floorLimit.nmerchantChainInd = trx.ctttransGroup;
        floorLimit.ngroupCardInd = trx.ctttransGroup;
        floorLimit.bampermitido = trx.ctttransGroup;
        listFloorLimit.push(floorLimit);
      });
    return listFloorLimit;
  }

  private loadValues() {
    // this.id = this.getValueFromString(this.rolPosApplication.id);
    // this.flagMultimoneda = this.getValueFromString(this.rolPosApplication.cmamultCurrency);
    // this.flagCuatroUlDigitos = this.getValueFromString(this.rolPosApplication.cmareqLastNumber);
    // this.flagSolicitarDNI = this.getValueFromString(this.rolPosApplication.cmareqDocId);
    // this.flagCashBack = this.getValueFromString(this.rolPosApplication.cmareqCashBack);
    // this.flagMultiproducto = this.getValueFromString(this.rolPosApplication.cmamultiproduct);

    // this.valueDigitacionTarjeta = this.rolPosApplication.cmacardWriter;
    // this.valueTipoCierre = this.rolPosApplication.cmacloseType;
    // this.valueTrxDefault = this.rolPosApplication.cmatrxDefault;
    // this.valueIngresoTarejta = this.rolPosApplication.cmaconfirmCardEntryMode;

    // this.flagHoraAtencion = this.getValueFromString(this.rolPosApplication.cmareqHourOperation);
    // this.valueHoraInicio = this.rolPosApplication.cmahourOperationFrom.substring(0, 2);
    // this.valueMinutoInicio = this.rolPosApplication.cmahourOperationFrom.substring(2, 4);
    // this.valueHoraFin = this.rolPosApplication.cmahourOperationTo.substring(0, 2);
    // this.valueMinutoFin = this.rolPosApplication.cmahourOperationTo.substring(2, 4);

    // this.flagAlarmaMontoMinimo = this.getValueFromString(this.rolPosApplication.cmareqMinimumAmount);
    // this.valueMontoMonedaLocal = this.rolPosApplication.nmaminAmountLocal;
    // this.flagAlarmaSMS = this.getValueFromString(this.rolPosApplication.cmareqAlarmSMS);
    // this.flagAlamarEmail = this.getValueFromString(this.rolPosApplication.cmareqAlarmEmail);
  }

  private getValueFromBoolean(value: boolean): string {
    if (value) {
      return '0';
    }
    return '1';
  }

  private getValueFromString(value: string): boolean {
    if (value == '0') {
      return true;
    }
    return false;
  }
//RolPosApplication
  getTrxSelectInit() {
    if (this.rolPosApplication.listArbolModulo != undefined) {
      this.listTransactionType.forEach(
        trx => {
          this.rolPosApplication.listArbolModulo.forEach(
            floor => {
              if (floor.idModulo == trx.ctttransactionId) {
                this.selectItemInit.push(trx);
              }
            });
        });
    }
  }
}
