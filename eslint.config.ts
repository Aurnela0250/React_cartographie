// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import tseslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";

// Obtenez le répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créez une instance compat pour convertir les configs traditionnelles
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended,
});

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    ...compat.config({
        extends: [
            "next/core-web-vitals",
            "plugin:react/recommended",
            "plugin:prettier/recommended",
            "plugin:react-hooks/recommended",
            "plugin:jsx-a11y/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:tailwindcss/recommended",
            "next",
            "prettier",
        ],
        plugins: [
            "react",
            "unused-imports",
            "tailwindcss",
            "import",
            "@typescript-eslint",
            "jsx-a11y",
            "prettier",
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: 12,
            sourceType: "module",
        },
        settings: {
            react: {
                version: "detect",
            },
            tailwindcss: {
                callees: ["cn"],
                config: "tailwind.config.js",
            },
            next: {
                rootDir: ["./"],
            },
        },
        rules: {
            indent: ["warn", 4],
            "no-console": "warn",
            "react/jsx-key": "off",
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": "off",
            "tailwindcss/no-custom-classname": "off",
            "@next/next/no-html-link-for-pages": "off",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "prettier/prettier": ["error", {}, { usePrettierrc: true }],
            "no-unused-vars": "off",
            "unused-imports/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "after-used",
                    ignoreRestSiblings: false,
                    argsIgnorePattern: "^_.*?$",
                },
            ],
            "react/self-closing-comp": "warn",
            "react/jsx-sort-props": [
                "warn",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],
            "padding-line-between-statements": [
                "warn",
                { blankLine: "always", prev: "*", next: "return" },
                {
                    blankLine: "always",
                    prev: ["const", "let", "var"],
                    next: "*",
                },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
            ],
        },
    })
);
