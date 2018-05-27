var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var APP_PATH = path.resolve(ROOT_PATH, 'app')
var JS_PATH = path.resolve(APP_PATH, 'js');
var ENTRY_PATH = path.resolve(JS_PATH, 'index.js');
var TEMPLATE_PATH = path.resolve(APP_PATH, 'index.html');

var debug = process.env.MODE_ENV !== 'production';

module.exports = {
    entry: ENTRY_PATH,
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: 'Matrix Operations Tutorial',
            template: TEMPLATE_PATH,
            inject: 'body',
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: JS_PATH,
                exclude: /(node_module|bower_components)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                },
            },
        ],
    },
};
