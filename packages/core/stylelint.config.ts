import type { Config } from "stylelint";

export default {
  extends: ["@nijesmik/stylelint-config"],
  rules: {
    /*
     * stylelint-config-standard's kebab-case pattern, plus Tailwind v4's theme
     * modifier: `--text-body-01--line-height` attaches a second key to a theme
     * value with a double dash, which plain kebab-case rejects.
     */
    "custom-property-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$",
  },
} satisfies Config;
