const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash:8].js',
      publicPath: isProduction ? './' : '/',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        meta: {
          'Cache-Control': {'http-equiv': 'Cache-Control', 'content': 'no-cache, no-store, must-revalidate'},
          'Pragma': {'http-equiv': 'Pragma', 'content': 'no-cache'},
          'Expires': {'http-equiv': 'Expires', 'content': '0'}
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          { 
            from: 'public/images', 
            to: 'images' 
          },
          // 如果有其他静态资源也需要复制，可以在这里添加
        ]
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 'auto',
      hot: true,
      historyApiFallback: true,
      devMiddleware: {
        publicPath: '/'
      }
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
}; 