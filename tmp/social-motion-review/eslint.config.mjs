import { createRequire } from 'node:module';
import { FlatCompat } from '@eslint/eslintrc';
const require = createRequire(import.meta.url);
const compat = new FlatCompat({ baseDirectory: process.cwd(), recommendedConfig: require('@eslint/js').configs.recommended });
export default [{ ignores: ['.next/**', 'node_modules/**', 'tmp/**'] }, ...compat.extends('next/core-web-vitals', 'next/typescript')];
