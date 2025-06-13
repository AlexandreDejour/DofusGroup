// eslint.config.mjs
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintConfig from "typescript-eslint";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  ...tseslintConfig.configs.recommended,
  ...tseslintConfig.configs.strictTypeChecked,
  ...tseslintConfig.configs.stylistic,
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },

    rules: {
      ...prettierConfig.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      "@typescript-eslint/no-inferrable-types": 0,
      "@typescript-eslint/typedef": [
          "warn",
          {
            variableDeclaration: true,
            memberVariableDeclaration: true,
            propertyDeclaration: true,
            parameter: true
          }
      ],
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "prettier/prettier": "error",
    },
  },
  prettierConfig
];
