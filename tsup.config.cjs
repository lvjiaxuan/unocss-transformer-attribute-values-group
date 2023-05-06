module.exports = {
  outExtension({ format }) {
    return {
      js: {
        cjs: '.cjs',
        esm: '.mjs',
        iife: '.js'
      }[format]
    }
  }
}