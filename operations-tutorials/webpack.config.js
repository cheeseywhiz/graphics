const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const JS_PATH = path.resolve(APP_PATH, 'js');

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
