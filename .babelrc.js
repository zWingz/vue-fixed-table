module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        modules: false,
        "useBuiltIns": "entry",
        "targets": {
          "browsers": ["last 2 versions"]
        }
      }
    ]
  ]
}
