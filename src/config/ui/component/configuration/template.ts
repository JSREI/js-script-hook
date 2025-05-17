/**
 * 配置界面的HTML模板
 */
import { closeButtonIcon } from './icons';

/**
 * 配置界面的HTML模板
 */
export const configurationTemplate = `
<div id="jsrei-js-script-hook-configuration-modal-window">
    <div class="js-script-hook-scrollable-div">
        <button id="jsrei-js-script-hook-configuration-close-btn">
            ${closeButtonIcon}
        </button>
        <div id="js-script-hook-configuration-content"></div>
    </div>
</div>
`; 