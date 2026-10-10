import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["src/shared/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/**", "**/app/**"],
              message:
                "Shared infrastructure must not depend on app or feature modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/features/**/pages/*.{js,jsx}",
      "src/features/**/components/*.{js,jsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "axios", message: "Use a feature hook for data access." },
          ],
          patterns: [
            {
              group: ["**/api/**"],
              message:
                "Views consume feature hooks; API access belongs in hooks or services.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/model/*.js"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["react", "react-router-dom", "axios"],
          patterns: ["**/hooks/**", "**/api/**", "**/notifications/**"],
        },
      ],
    },
  },
  {
    files: ["**/*.config.js", "src/test/architecture.test.js"],
    languageOptions: { globals: globals.node },
  },
]);
