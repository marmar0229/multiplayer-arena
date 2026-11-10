import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // Keeps core TS checks, drops the hyper-strict type-checked rules
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // ✅ TURN OFF OVERLY STRICT DEV RULES:
      'no-console': 'off', // Allows console.log
      '@typescript-eslint/no-floating-promises': 'off', // Allows runLogin() without void/await
      '@typescript-eslint/no-unsafe-assignment': 'off', // Allows letting response.json() infer naturally
      '@typescript-eslint/no-unsafe-member-access': 'off', // Allows reading properties off inferred types
      '@typescript-eslint/restrict-template-expressions': 'off', // Allows using any variable in `Bearer ${token}`
      '@typescript-eslint/no-non-null-assertion': 'off', // Fixes the main.tsx document.getElementById('root')! error
      '@typescript-eslint/no-explicit-any': 'off', // Allows 'any' if it pops up anywhere else
    },
  },
)
