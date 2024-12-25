import globals from "globals";
import pluginJs from "@eslint/js";



export default [
  {languageOptions: { globals: globals.browser }},
  {
    files: ['**/*.js'], // Target all .js files in the backend folder, modify as needed
     languageOptions: {
       sourceType: 'module', // Set to 'module' to use es6 syntax
        globals: {
          ...globals.node, // add node globals
          process: true, // Explicitly add process for node
        },
    rules: {
      semi: ['error', 'always'], // Enforce semicolons at the end of statements
           // other rules
      },
    },
  },
    pluginJs.configs.recommended,  // You can also include this config
];

