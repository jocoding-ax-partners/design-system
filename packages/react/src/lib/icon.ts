/**
 * 이 패키지의 아이콘 **타입** 단일 출처.
 *
 * 아이콘 세트를 Phosphor 하나로 강제하는 결정(2026-09)이 이 파일에 모여 있어
 * 나중에 바뀔 때 고칠 자리가 하나다.
 *
 * 아이콘 **컴포넌트**(`CaretDown`·`X` 등)는 여기를 거치지 않고
 * `@phosphor-icons/react` 에서 직접 import 한다 — 값까지 재수출하면 배럴이
 * 아이콘 전체를 끌어와 트리셰이킹이 깨진다. 세트를 하나로 묶는 강제는
 * `eslint.config.ts` 의 `no-restricted-imports` 가 담당한다.
 */
export type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
