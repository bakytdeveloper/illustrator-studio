import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.config.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // ===== ПУСТЫЕ СТРОКИ МЕЖДУ ЛОГИЧЕСКИМИ БЛОКАМИ =====
      'padding-line-between-statements': [
        'error',
        // Пустая строка перед return
        { blankLine: 'always', prev: '*', next: 'return' },
        // Пустая строка между объявлениями переменных и следующим кодом
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        // Разрешить несколько объявлений переменных подряд без пустых строк
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        // Пустая строка до и после function
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'function' },
        // Пустая строка до и после class
        { blankLine: 'always', prev: 'class', next: '*' },
        { blankLine: 'always', prev: '*', next: 'class' },
        // Пустая строка до и после блоков (if/for/while/try/switch)
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        // Пустая строка после импортов
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        // Пустая строка до и после export
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'always', prev: '*', next: 'export' },
        // Пустая строка после многострочных выражений (например, длинных тернарников)
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
      ],
    },
  },
];
