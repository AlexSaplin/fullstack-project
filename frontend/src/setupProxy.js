const { createProxyMiddleware }  = require('http-proxy-middleware');

module.exports = function(app) {
    // Django static files
    app.use(
        '/dj_static',
        createProxyMiddleware({
            target: 'http://django:16000',
            changeOrigin: false,
        })
    );

    // Django server media (uploaded by user)
    app.use(
        '/media',
        createProxyMiddleware({
            target: 'http://django:16000',
            changeOrigin: false,
        })
    );

    // Backend API
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://django:16000',
            changeOrigin: false,
        })
    );

    // Backend API admin panel
    app.use(
        '/admin',
        createProxyMiddleware({
            target: 'http://django:16000',
            changeOrigin: false,
        })
    );
};