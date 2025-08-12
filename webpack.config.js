// webpack.config.js
'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',

    entry: {
        scripts: './src/js/main.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/scripts.js',
        clean: true
    },

    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 9000,
        historyApiFallback: true,
        client: { overlay: true }
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['scripts']
        }),
        new HtmlWebpackPlugin({
            template: './src/privacy.html',
            filename: 'privacy.html',
            chunks: ['scripts']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
                { from: 'css', to: 'css' },
                { from: 'data', to: 'data' },
                { from: 'ads.txt', to: 'ads.txt' },
                { from: '_redirects', to: '_redirects'}
            ]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/js')
        }
    }
};