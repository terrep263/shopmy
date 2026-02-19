import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/theme/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-const": "off"
    }
  },
  {
    files: ["src/components/listinghub/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off"
    }
  },
  {
    files: ["src/theme/**/*", "src/listinghub/**/*"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off"
    }
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/app/api/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "middleware.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/immutability": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  },
  {
    files: ["puck/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "ListingHub/**"
  ]),
]);

export default eslintConfig;
