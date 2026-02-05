module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "linebreak-style": "off", // <<< DESLIGA O ERRO CRLF/LF
  },
  parserOptions: {
    sourceType: "module",
  },
};
