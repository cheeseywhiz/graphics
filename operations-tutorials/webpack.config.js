var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var JS_PATH = path.resolve(APP_PATH, 'js');

module.exports = {
    entry: {
        index: path.resolve(JS_PATH, 'index.js'),
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].bundle.js',
    },
    plugins: [
        new UglifyJsPlugin(),
        new HtmlWebPackPlugin({
            title: 'Matrix Operations Tutorial',
            template: path.resolve(APP_PATH, 'index.html'),
            filename: 'index.html',
            chunks: ['index'],
            inject: 'head',
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
