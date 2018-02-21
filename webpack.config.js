const path = require('path');
const webpack = require('webpack');

module.exports = () => {
  const { NODE_ENV } = process.env;

  const plugins = [];
  plugins.push(new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
  }));

  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());

  let externals = {};

  const mainEntry = [];
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
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
  };

  return {
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
      library: 'MobX-Form',
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
