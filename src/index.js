const {DocumentHook} = require("./hook/document-hook");
const {getUnsafeWindow} = require("./utils/scope-util");


(async () => {
    // 增加可视化的配置

    // 为document增加hook点
    const unsafeWindow = getUnsafeWindow();
    new DocumentHook(unsafeWindow.document).addHook();
})();




