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
    "react/prop-types": 0,
    "no-console": 0,
    "no-unused-vars": 0,
    "react/react-in-jsx-scope": 0,
    "react/no-unsafe": "error",
    "react-hooks/rules-of-hooks": "error",
  },
};
