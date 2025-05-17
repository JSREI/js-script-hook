const common = require("./webpack.common.js");
const {merge} = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    //开启这个可以在生产环境中调试代码
    devtool: "source-map",
    // 两个原因：
    // 1. 在油猴商店上架的脚本不允许混淆和压缩
    // 2. 不混淆不压缩保留注释能够稍微增加一点用户的信任度
    mode: "none",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        // 确保只输出一个文件
        clean: true
    },
    externals: {
        // 2024-12-17 23:10:46 草，好像排除掉之后webpack就找不到模块了，全局引入的无法识别
        // 'webpack': 'webpack',
        // 'webpack-cli': 'webpack-cli',
        // 'webpack-merge': 'webpack-merge',
        // 'jszip': 'jszip',
        // 'idb': 'idb',
        // 'current-script-polyfill': 'current-script-polyfill',
    }
});