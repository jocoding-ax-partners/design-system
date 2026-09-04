import type { Config } from "stylelint";

export default {
  extends: ["@nijesmik/stylelint-config", "@nijesmik/stylelint-config/bem"],
  rules: {
    "at-rule-empty-line-before": [
      "always",
      {
        except: ["blockless-after-same-name-blockless", "first-nested"],
        ignore: ["after-comment"],
        ignoreAtRules: ["else", "import"],
      },
    ],
    "comment-empty-line-before": null,

    /*
     * stylelint-config-standard's kebab-case pattern predates this package's
     * density work, which is the first place heroui overrides reference a
     * Tailwind v4 theme modifier directly (`--text-caption-01--letter-spacing`
     * in button.css) rather than only via `@apply`. The double dash attaches a
     * second key to a theme value, which plain kebab-case rejects.
     * Sibling override: packages/tailwind/stylelint.config.ts — same rule, same
     * reason, kept in sync as a pair.
     */
    "custom-property-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*(--([a-z][a-z0-9]*)(-[a-z0-9]+)*)?$",
  },
} satisfies Config;
