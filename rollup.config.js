import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import sass from 'node-sass'
import autoprefixer from 'autoprefixer'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'
import VuePlugin from 'rollup-plugin-vue'
const babelrc = require('./.babelrc.js')
export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    VuePlugin(),
    external(),
    postcss({
      preprocessor: (content, id) => new Promise(res => {
          const result = sass.renderSync({ file: id })
          res({ code: result.css.toString() })
        }),
      plugins: [autoprefixer],
      minimize: true,
      // extract: true,
      extensions: ['.sass', '.css']
    }),
    babel({
      exclude: 'node_modules/**',
      ...babelrc
      // externalHelpers: true
    }),
    resolve({
      extensions: ['.js', '.vue', '.json']
    }),
    commonjs()
  ]
}
