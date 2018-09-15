module.exports = {
  "comments": false,
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "useBuiltIns": "entry",
        "targets": {
          "browsers": ["last 2 versions"]
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
