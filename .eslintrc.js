module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "plugin:react/recommended",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "no-console": "error",
    "no-unused-vars": "error",
    "react/react-in-jsx-scope": "error",
    "react/no-unsafe": "error",
    "react-hooks/rules-of-hooks": "error",
  },
};
