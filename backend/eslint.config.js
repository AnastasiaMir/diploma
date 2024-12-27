import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: true,
      },
    },
    rules: {
      semi: ['error', 'always'], // Enforce semicolons
      indent: ['error', 2], // Enforce 2-space indentation
    },
  },
  pluginJs.configs.recommended,
];
