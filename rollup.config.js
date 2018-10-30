import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const env = process.env.NODE_ENV;

const config = {
  external: Object.keys(pkg.peerDependencies || {}),
  input: 'src/index.js',
  output: {
    format: 'umd',
    globals: {
      mobx: 'mobx',
      'mobx-react': 'mobx-react',
      react: 'React',
    },
    name: 'mobx-formstate',
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonjs(),
  ],
};

if (env === 'production') {
  config.plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }));
}

export default config;
