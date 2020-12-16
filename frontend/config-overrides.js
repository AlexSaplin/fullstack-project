const { override, fixBabelImports, addBundleVisualizer, overrideDevServer } = require('customize-cra');

const overrideDevServerProperties = () => (configFunction) => {
    configFunction.compress = true;
    configFunction.disableHostCheck = true;
    return configFunction;
}

module.exports = {
    webpack: override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css',
        }),
        // addBundleVisualizer()
    ),
    devServer: overrideDevServer(
        overrideDevServerProperties(),
    )
}
