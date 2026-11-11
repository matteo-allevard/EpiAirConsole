// ESLint flat config for the whole monorepo.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/coverage/**", "**/node_modules/**", "playwright-report/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Node.js code: server, scripts, config files
  {
    files: ["apps/server/**/*.ts", "scripts/**/*.mjs", "*.mjs", "**/vite.config.ts"],
    languageOptions: { globals: globals.node },
  },

  // Browser code: console and controller (React)
  {
    files: ["apps/console/src/**/*.{ts,tsx}", "apps/controller/src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Accessibility is a hard requirement of the project (WCAG 2.2 AA).
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  // Formatting is Prettier's job: turn off every rule that conflicts with it. Keep last.
  prettier
);
