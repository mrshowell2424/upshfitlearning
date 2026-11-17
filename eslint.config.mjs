import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Not our code.
    //
    // Everything below is either a canvas export or an archived handoff:
    // files written by another tool, committed whole, and never edited by
    // hand. support.js alone is nine byte-identical copies of the same
    // vendored runtime, and it was contributing eighteen errors about a
    // deprecated ReactDOM.render we do not call and a `module` variable we
    // do not assign. Linting a file nobody may edit produces warnings
    // nobody may act on, and a lint run that is permanently red is one
    // nobody reads.
    //
    // The lesson HTML in these folders is the product and it is checked:
    // scripts/check-generated.mjs rebuilds every generated file and fails
    // on drift, and the seed's own read-back checks run against what is
    // actually served.
    "_archive/**",
    "content-reading-materials/**",
    "Design Thinking/**",
    "Science of Reading/**",
  ]),
]);

export default eslintConfig;
