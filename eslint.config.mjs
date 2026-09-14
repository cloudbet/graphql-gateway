import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      "**/.yarn",
      "**/node_modules",
      "**/.pnp.*",
      "**/generated/",
      "**/dist",
      "eslint.config.mjs",
      "lint-staged.config.mjs",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    plugins: {
      "unused-imports": fixupPluginRules(unusedImports),
      "import-plugin": fixupPluginRules(importPlugin),
      promise: promisePlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2017,
      sourceType: "commonjs",
    },
    rules: {
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "prefer-const": "error",
      "no-return-await": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-namespace": "error",
      "no-extra-boolean-cast": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": 1,
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-shadow": "error",
      "promise/prefer-await-to-then": "error",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "promise/prefer-await-to-callbacks": "error",
      "no-else-return": "error",
      "no-trailing-spaces": "error",
      "prefer-template": "error",
      eqeqeq: "error",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "no-console": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "promise/no-return-wrap": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "no-unneeded-ternary": "error",
      "no-empty-pattern": [
        "error",
        {
          allowObjectPatternsAsParameters: true,
        },
      ],
      "@typescript-eslint/require-await": "error",
      "no-multiple-empty-lines": "error",
      "@typescript-eslint/restrict-plus-operands": "error",

      "import-plugin/order": [
        "error",
        {
          distinctGroup: true,
          "newlines-between": "always-and-inside-groups",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            ["internal", "external"],
            ["parent", "sibling", "index"],
          ],
        },
      ],
      "import-plugin/newline-after-import": ["error", { count: 1 }],
      "import-plugin/no-default-export": "off",
      "import-plugin/no-duplicates": "error",
      "import-plugin/no-useless-path-segments": "error",
      "import-plugin/no-relative-packages": "error",
    },
    settings: {
      "import-plugin/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import-plugin/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
