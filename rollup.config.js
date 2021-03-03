// Rollup
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve'

// 3p
import rollupPluginStaticFiles from 'rollup-plugin-static-files'
import rollupPluginServe from 'rollup-plugin-serve'

// Detect watch mode for rollup
const watchEnabled = process.env.ROLLUP_WATCH === 'true'

export default {
  input: 'src/index.js',
  output: {
    dir: 'build',
    format: 'esm',
    entryFileNames: 'assets/js/[name].js',
    sourcemap: true,
  },
  plugins: [
    rollupPluginNodeResolve(),
    // Copy static files
    rollupPluginStaticFiles({ include: ['./public'] }),
    // Serve
    watchEnabled && rollupPluginServe({
      contentBase: ['build'],
      historyApiFallback: true,
      host: 'localhost',
      port: 3000,
    }),
  ],
  watch: {
    clearScreen: false
  }
}
