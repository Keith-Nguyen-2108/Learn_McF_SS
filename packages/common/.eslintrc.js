module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "vue/html-self-closing": "off",
    "vue/html-indent": "off",
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/require-explicit-emits": "off",
    "vue/multi-word-component-names": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
