/**
 * 아이콘 세트 강제 — 레포 전체가 공유하는 단일 출처.
 *
 * 사용자 지시(2026-09): "아이콘 세트는 하나로 하는 게 좋을 것 같아 … 포스포어를
 * 강제하고, 디자인 시스템에서도 그 포스포어를 강제해줘."
 *
 * **허용 목록(allowlist)이다. 금지 목록이 아니다.** 이전 판은 다섯 개 이름
 * (`@iconify/*` · `lucide-react` · `react-icons` · `@radix-ui/react-icons` ·
 * `@heroicons/*`)만 막는 denylist 였는데, `eslint --stdin` 으로 재 보니
 * `@tabler/icons-react` 와 `feather-icons` 가 그대로 통과했다(2026-09-09 실측).
 * 다섯 개를 금지하는 것과 하나를 강제하는 것은 다르다.
 *
 * `group`(glob) 이 아니라 `regex` 를 쓰는 이유는 실측 때문이다. `group` 은 내부적으로
 * `ignore` 패키지(=gitignore 문법)로 매칭되는데, gitignore 는 **부모 디렉터리가 제외되면
 * 자식을 다시 포함할 수 없다.** 그래서 `"*icon*"` + `"!@phosphor-icons/react"` 조합이
 * Phosphor 자신을 막아버렸고(2026-09-09 `--stdin` 실측: `@phosphor-icons/react` -> 에러 1건),
 * 동시에 `"*icon*"` 이 경로 아무 층에서나 걸려 내부 import `./lib/icon.js` 까지 막았다.
 * `regex` 는 앵커와 부정 전방탐색이 그대로 동작한다.
 *
 * 이 설정을 `packages/react` 안이 아니라 루트에 두는 이유: 이전 판은
 * `packages/react/eslint.config.ts` 의 `files: ["src/**"]` 안에만 있어서, 같은 컴포넌트를
 * 전시하는 `apps/storybook` 과 `packages/heroui` 는 아무 검사도 받지 않았다.
 */
const PHOSPHOR = "@phosphor-icons/react";

/**
 * 이름에 `icon` 이 들어간 bare specifier 를 전부 막고 Phosphor 만 연다.
 * `caseSensitive` 를 안 주므로 ESLint 가 `iu` 플래그로 컴파일한다 — 대소문자 무시.
 *
 * 세 갈래를 본다(정규식 리터럴을 주석에 그대로 적으면 슬래시-별표가 주석을 닫아버려
 * 말로 적는다):
 *
 * 1. Phosphor 와 그 하위 경로는 맨 앞 부정 전방탐색으로 통과시킨다.
 * 2. relative(`.` 시작)도 스코프(`@` 시작)도 아닌 최상위 패키지명에 `icon` 이 있으면 막는다
 *    — `react-icons`, `feather-icons`.
 * 3. 스코프 이름 자체에 `icon` 이 있으면 막는다 — `@iconify`, `@heroicons`.
 * 4. 스코프 안 패키지명에 `icon` 이 있으면 막는다 — `@tabler/icons-react`,
 *    `@radix-ui/react-icons`.
 */
const ICON_NAME_REGEX =
  "^(?!@phosphor-icons\\/react(?:$|\\/))(?:(?![.@])[^/]*icon|@[^/]*icon[^/]*\\/|@[^/]+\\/[^/]*icon)";

/** 이름에 icon 이 없어 위 그물에 안 걸리는 것들. 메시지를 구체적으로 유지하는 자리이기도 하다. */
const ICON_PACKAGES_WITHOUT_ICON_IN_NAME = ["lucide-react", "lucide-react/*"];

export const iconRule = [
  "error",
  {
    patterns: [
      {
        regex: ICON_NAME_REGEX,
        message: `아이콘 세트는 ${PHOSPHOR} 하나다(2026-09 결정). 타입은 packages/react 의 lib/icon.ts 가 단일 출처다.`,
      },
      {
        group: ICON_PACKAGES_WITHOUT_ICON_IN_NAME,
        message: `아이콘 세트는 ${PHOSPHOR} 하나다(2026-09 결정). lucide-react 는 이름에 icon 이 없어 따로 막는다.`,
      },
    ],
  },
];

/** 플랫 설정 조각. 각 패키지의 eslint.config 가 스프레드해 쓴다. */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    rules: { "no-restricted-imports": iconRule },
  },
];
