const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const cesiumSource = './node_modules/cesium/Source'

module.exports = {
  publicPath: '',
  lintOnSave: true,
  productionSourceMap: false,
  filenameHashing: true,
  devServer: {
    // port: 3306,
    open: true,
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' ' // 让 webpack 正确处理多行字符串配置 amd 参数
    },
    amd: {
      toUrlUndefined: true // webpack 在 cesium 中能友好的使用 require
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'cesium': path.resolve(__dirname, cesiumSource) // 定义别名 cesium 后，cesium 代表了 cesiumSource 的文件路径
      }
    },
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Workers'), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: '@open-wc/webpack-import-meta-loader',
          },
        },
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
        }),
      ]
    },
  },
  // pwa: {
  //   iconPaths: {
  //     favicon32: "favicon.ico",
  //     favicon16: "favicon.ico",
  //     appleTouchIcon: "favicon.ico",
  //     maskIcon: "favicon.ico",
  //     msTileImage: "favicon.ico"
  //   }
  // }
}