const path = require('path');

module.exports = () => ({
  entry: { main: './src/index' },
  externals: ['react', 'mobx'],
  mode: 'production',
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
  resolve: {
    alias: {
      mobx: path.resolve(__dirname, 'node_modules/mobx'),
      'mobx-react': path.resolve(__dirname, 'node_modules/mobx-react'),
    },
    extensions: ['.json', '.js'],
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
  },
});
