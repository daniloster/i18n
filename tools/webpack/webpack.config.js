const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

module.exports = {
  entry: './DEV/index.jsx',
  devtool: 'source-map',
  node: {
    global: false,
    __dirname: false,
    __filename: true,
  },
  resolve: {
    alias: {
      '@daniloster/i18n': path.resolve('./src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|((?!d\.)ts)|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',

        },
      },
      {
        /**
         * Any other file than the (tsx|ts|jsx|js) will be taken care by url-loader
         * falling back to file-loader
         */
        // test: /\.(png|jpg|jpeg|gif)$/i,
        test: /^(.(?!(html|js|jsx|ts|tsx)))+$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '../../dist/.app/'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4001,
    publicPath: '/',
  },
  output: {
    path: path.resolve(__dirname, '../../dist/.app/'),
    filename: 'index.js',
    publicPath: './',
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: 'DEV/assets', to: 'assets' }] }),
    new WorkerPlugin(),
    new HtmlWebpackPlugin({ title: 'Shopping Builder' }),
  ],
}
