import type { Config } from "stylelint";

export default {
  extends: ["stylelint-config-standard"],
  plugins: ["@stylistic/stylelint-plugin"],
  rules: {
    // Tailwind CSS @규칙 허용 (@source, @theme 등 v4 포함)
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "theme",
          "source",
        ],
      },
    ],

    // BEM 패턴 (예: .button--sm, .button__icon)
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      { message: "Expected class selector to be BEM pattern (block__element--modifier)" },
    ],

    // @import url() vs @import "" 방식 제한 해제
    "import-notation": null,

    // 파일 끝에 빈 줄 필수
    "@stylistic/no-missing-end-of-source-newline": true,

    // 연속 빈 줄 최대 1개
    "@stylistic/max-empty-lines": 1,
  },
} satisfies Config;
