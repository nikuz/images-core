const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let scriptName = 'bundle.js';
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    scriptName = 'bundle.min.js';
}
let devtool = 'eval-source-map';
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const dstPath = path.resolve(appDirectory, './dst');
const publicPath = path.resolve(appDirectory, './src/public');
const indexPath = path.resolve(appDirectory, publicPath, 'index.html');

const plugins = [
    new CopyWebpackPlugin([{
        from: path.resolve(appDirectory, publicPath),
        to: dstPath,
    }]),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: indexPath,
        scriptName,
        rootPath: '/',
        inject: false,
    }),
    new webpack.EnvironmentPlugin([
        'NODE_ENV',
    ]),
];

let cacheDirectory = true;
let optimization;
if (isProduction) {
    cacheDirectory = false;
    optimization = {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    };
    devtool = 'source-map';
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

const rules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory,
                presets: [
                    ['@babel/preset-env', {
                        targets: {
                            chrome: '72',
                        },
                    }],
                ],
                plugins: [
                    [
                        require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true },
                    ],
                    require.resolve('@babel/plugin-proposal-class-properties'),
                ],
            },
        },
    },
    {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        loaders: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
        ],
    },
    {
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        use: [
            {
                loader: require.resolve('file-loader'),
                options: {
                    limit: 1000000,
                    name: '/fonts/[name].[ext]',
                },
            },
        ],
    },
];

const options = {
    mode: isProduction ? 'production' : 'development',
    entry: isProduction ? './src/index.js' : './test/index.js',
    target: 'web',
    output: {
        path: dstPath,
        filename: scriptName,
        libraryTarget: isProduction ? 'commonjs2' : 'var',
    },
    devtool,
    module: {
        strictExportPresence: true,
        rules,
    },
    plugins,
    devServer: {
        contentBase: dstPath,
        hot: true,
        inline: true,
        compress: true,
        port: 9000,
        watchOptions: {
            ignored: /node_modules/,
        },
    },
    optimization,
    performance: {
        hints: false,
    },
};
module.exports = options;
