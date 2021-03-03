// Rollup
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve'
import rollupPluginAlias from '@rollup/plugin-alias'
import rollupPluginReplace from '@rollup/plugin-replace'

// 3p
import rollupPluginStaticFiles from 'rollup-plugin-static-files'
import rollupPluginServe from 'rollup-plugin-serve'

// Detect watch mode for rollup
const watchEnabled = process.env.ROLLUP_WATCH === 'true'

// Resolve mode
const mode = process.env.NODE_ENV || watchEnabled
  ? 'development'
  : 'production'

export default {
  input: 'src/index.js',
  output: {
    dir: 'build',
    format: 'esm',
    entryFileNames: 'assets/js/[name].js',
    sourcemap: true,
  },
  plugins: [
    rollupPluginAlias({
      entries: [
        // See https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ]
    }),
    rollupPluginReplace({
      // Replace global with globalThis/ window
      'global': 'window',
      // Sen environment
      'process.env.NODE_ENV': JSON.stringify(mode),
      preventAssignment: true,
    }),
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
