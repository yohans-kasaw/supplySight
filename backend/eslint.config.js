import js from '@eslint/js'
import globals from "globals";
import tseslint from 'typescript-eslint'
export default tseslint.config([
    {
        files: ['**/*.{ts}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
            parserOptions: {
                project: ['./tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
