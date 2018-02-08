const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  const { NODE_ENV } = process.env;

  const plugins = [];
  plugins.push(new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
  }));
  if (NODE_ENV !== 'production') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new HtmlWebpackPlugin({
    title: 'React framework',
  }));
  let devServer = {};
  let externals = {};

  const mainEntry = [];
  if (NODE_ENV === 'production') {
    // No need for an uglify plugin since we're building with -p
    mainEntry.push('./src/index');
    // The dependencies we use in our framework have to bel isted here so our Consumer can install them
    externals = {
      mobx: {
        amd: 'mobx',
        commonjs: 'mobx',
        commonjs2: 'mobx',
        root: 'mobx',
      },
      'mobx-react': {
        amd: 'mobx-react',
        commonjs: 'mobx-react',
        commonjs2: 'mobx-react',
        root: 'mobx-react',
      },
      'mobx-state-tree': {
        amd: 'mobx-state-tree',
        commonjs: 'mobx-state-tree',
        commonjs2: 'mobx-state-tree',
        root: 'mobx-state-tree',
      },
      react: {
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
        root: 'React',
      },
    };
  } else {
    // We include babel-polyfill for our example project.
    mainEntry.push('babel-polyfill');
    mainEntry.push('react-hot-loader/patch');
    mainEntry.push('webpack-dev-server/client?http://127.0.0.1:3000');
    mainEntry.push('webpack/hot/only-dev-server');
    mainEntry.push('./example');
    devServer = {
      clientLogLevel: 'none',
      contentBase: './dist',
      historyApiFallback: true,
      host: '127.0.0.1',
      hot: true,
      inline: true,
      port: 3000,
      publicPath: '/',
      // Attempt at resolving our header issues.
    };
  }

  return {
    devServer,
    devtool: 'source-map',
    entry: {
      main: mainEntry,
    },
    externals,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(js)$/,
          use: ['babel-loader'],
        },
        {
          test: /\.eot$|\.ttf$|\.woff$|\.woff2$/,
          use: ['url-loader'],
        },
        {
          test: /\.gif$|\.jpg$|\.jpeg$|\.png$|\.svg$|\.pdf$/,
          use: ['file-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      filename: 'index.js',
      library: 'CodiflyReactFramework',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      umdNamedDefine: true,
    },
    plugins,
    resolve: {
      alias: {
        'mobx-form': path.resolve('src'),
      },
      extensions: ['.json', '.js'],
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
    },
    stats: {
      moduleTrace: false,
    },
  };
};
