import { SubMenu } from './sub-menu';
import { Menu } from './menu';

export class MenuTree {
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
    listArbolModulo: MenuTree[];
}
