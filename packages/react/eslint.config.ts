import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

import baseConfig from "@nijesmik/eslint-config";

// This package's entire purpose is to hold components promoted verbatim from
// axhub-frontend/src/components/ui/ — their prop/key ordering belongs to that
// source, not to us. Reordering destructured props to satisfy an alphabetical
// rule here would make the promoted files silently diverge from what
// production ships. The base config already leaves object *expressions*
// unsorted (`objectType: "non-destructured"`); this adds the matching entry
// for destructured objects (e.g. function-parameter patterns) so both are
// unsorted, not just one — narrowed to exactly this rule, not the whole
// perfectionist plugin.
//
// react-hooks is registered here (mirroring apps/storybook/eslint.config.js)
// because this package is now the canonical home for eleven promoted React
// components and, before this, nothing checked their hooks usage at all. It
// also makes ConfirmDialog.tsx's verbatim `// eslint-disable-next-line
// react-hooks/refs` comment resolve against a real rule instead of erroring
// as an unknown rule name.
export default defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "perfectionist/sort-objects": [
        "error",
        {
          type: "unsorted",
          useConfigurationIf: { objectType: "non-destructured" },
        },
        {
          type: "unsorted",
          useConfigurationIf: { objectType: "destructured" },
        },
      ],
    },
  },
]);
