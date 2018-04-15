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
  const mobx = 'mobx';
  const react = 'react';
  // No need for an uglify plugin since we're building with -p
  mainEntry.push('./src/index');
  // The dependencies we use in our framework have to bel isted here so our Consumer can install them
  externals = {
    mobx,
    'mobx-react': 'mobx-react',
    react,
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
      ],
    },
    output: {
      filename: 'index.js',
      library: 'mobx-formstate',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      umdNamedDefine: true,
    },
    plugins,
    resolve: {
      alias: {
        mobx: path.resolve(__dirname, 'node_modules/mobx'),
        'mobx-react': path.resolve(__dirname, 'node_modules/mobx-react'),
      },
      extensions: ['.json', '.js'],
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
    },
  };
};
