import { registerMenu, show } from '../config/ui/menu';
import { getUnsafeWindow } from '../utils/scope-util';
import { DocumentHook } from '../hook/document-hook';
import { initConfig, getGlobalConfig } from '../config/config';

declare function GM_getValue(key: string): any;
declare function GM_setValue(key: string, value: any): void;

/**
 * 初始化整个脚本
 */
export function init(): void {
    // 加载配置
    initConfig();

    // 增加可视化的配置
    registerMenu();

    // 为document增加hook点
    new DocumentHook(getUnsafeWindow().document).addHook();

    if (GM_getValue("js-script-hook-open-configuration")) {
        GM_setValue("js-script-hook-open-configuration", false);
        show();
    }
} 