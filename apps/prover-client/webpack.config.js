const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    main: './src/main.tsx',
    verify: './src/verify.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/',
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
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  '@tailwindcss/postcss',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            filename: '[name].[contenthash].worker.js',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      crypto: false,
      stream: false,
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    },
  },
  plugins: [
    new Dotenv({
      systemvars: true, // Load system environment variables as well
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['main'],
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/verify.html',
      chunks: ['verify'],
      filename: 'verify.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
        },
        {
          from: 'node_modules/tlsn-js/build',
          to: '',
          force: true,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,   
    historyApiFallback: {
      // disableDotRule: true means files with dots (extensions) won't be caught
      // This allows .wasm files to be served directly by webpack-dev-server
      disableDotRule: true,
      rewrites: [
        { from: /^\/verify$/, to: '/verify.html' },
        { from: /^\/verify\/$/, to: '/verify.html' },
      ],
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app?.use((req, res, next) => {
        const pathToCheck = req.path || '';
        const referer = req.headers.referer || req.headers.referrer || '';
        const needsIsolation =
          pathToCheck === '/verify' ||
          pathToCheck === '/verify/' ||
          pathToCheck === '/verify.html' ||
          (typeof referer === 'string' && referer.includes('/verify'));

        if (needsIsolation) {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        }
        next();
      });

      return middlewares;
    },
  },
  devtool: 'source-map',
};
