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
export default [
  ...baseConfig,
  {
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
];
