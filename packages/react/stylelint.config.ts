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
  },
} satisfies Config;
