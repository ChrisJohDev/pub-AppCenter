export default {
  features: {
    viteClient: false,
    hot: false
  },
  root: 'src',
  build: {
    outDir: '../dist',
    target: 'esnext'
  },
  server: {
    hmr: false
  }
}
