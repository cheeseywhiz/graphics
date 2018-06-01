const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const JS_PATH = path.resolve(APP_PATH, 'js');

module.exports = {
    mode: "development",
    entry: {
        index: path.resolve(JS_PATH, 'index.js'),
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].bundle.js',
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: 'Composite Operations',
            template: path.resolve(APP_PATH, 'index.html'),
            filename: 'index.html',
            chunks: ['index'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: JS_PATH,
                exclude: /node_module/,
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                },
            },
        ],
    },
};
