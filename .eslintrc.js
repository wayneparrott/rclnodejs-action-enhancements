module.exports = {
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  parser: '@typescript-eslint/parser',
  "parserOptions": {
    "ecmaVersion": 2018,
    "project": "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "prettier"],
  root: true,
  rules: {
    "prettier/prettier": ["error"],
    "semi": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-inferrable-types": [
      "warn",
      {
        "ignoreParameters": true
      }
    ],
    "no-underscore-dangle": "off",
    "no-shadow": "off",
    "no-new": 0,
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": "warn",
    "quotes": [2, "single", { "avoidEscape": true }],
    "class-methods-use-this": "off",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "parent", "sibling", "index"],
        "alphabetize": {
          "order": "asc"
        }
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ]
  }
};