// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebPackObfuscator=require('webpack-obfuscator')
const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;
console.log('path11 ', path.resolve(__dirname, './public/favicon.ico'));
const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            // favicon: path.resolve(__dirname, './public/favicon.ico'),
        }),

        new MiniCssExtractPlugin(),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new WebPackObfuscator({rotateUnicodeArray:true},[])
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|ico)$/i,
                loader: 'url-loader',
                options: {
                    // 图片小于10kb，就会被base64处理
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度变慢）
                    limit: 10 * 1024,
                    // 问题url-loader默认使用es6，html-loader使用的是commonjs
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 图片文件命名规则
                    name: '[hash:10].[ext]',
                },
            },
            {
                // 处理html文件中的img图片（负责引入img，从而能被url-loader进行处理）
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    // attrs: ['img:src', 'link:href'],
                    esModule: false,
                },
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        // fallback: { crypto: false },
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};
