const path = require('path');
const webpack = require('webpack');

const mobxExternal = {
  amd: 'mobx',
  commonjs: 'mobx',
  commonjs2: 'mobx',
  root: 'Mobx',
};

const mobxReactExternal = {
  amd: 'mobx-react',
  commonjs: 'mobx-react',
  commonjs2: 'mobx-react',
  root: 'Mobx-React',
};

const reactExternal = {
  amd: 'react',
  commonjs: 'react',
  commonjs2: 'react',
  root: 'React',
};

module.exports = () => {
  const { NODE_ENV } = process.env;

  const plugins = [];

  let externals = {};

  const main = [];

  // No need for an uglify plugin since we're building with -p
  main.push('./src/index');
  // The dependencies we use in our framework have to bel isted here so our Consumer can install them
  externals = {
    mobx: mobxExternal,
    'mobx-react': mobxReactExternal,
    react: reactExternal,
  };

  return {
    entry: { main },
    externals,
    mode: NODE_ENV,
    module: {
      rules: [
        {
          exclude: /node_modules\.*/,
          test: /\.(js)$/,
          use: ['babel-loader?cacheDirectory=true'],
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
