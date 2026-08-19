# CLAUDE.md

## 배포 (npm publish)

### 대상 패키지
- `@jocoding-ax-partners/design-system` — npm public org scope

### 워크플로우
1. `pnpm changeset` — changeset 생성 (변경 내용 기술)
2. `pnpm version-packages` — 버전 bump + CHANGELOG 업데이트
3. 변경사항 커밋
4. `git tag -a '@jocoding-ax-partners/design-system@<version>' -m '@jocoding-ax-partners/design-system@<version>'`
5. `git push --follow-tags`
6. `git ls-remote --tags origin` — 태그가 실제로 올라갔는지 확인
7. `pnpm release` — 빌드 + publish

### 규칙
- 직접 `npm publish`하지 말 것. 반드시 changesets 워크플로우를 사용
- 버전을 수동으로 bump하지 말 것. `version-packages`가 처리
- changeset 본문은 **영어로 작성**할 것 (CHANGELOG가 그대로 npm에 배포됨)
- 태그는 `@jocoding-ax-partners/design-system@<version>` 형식
- 태그는 반드시 **annotated**(`git tag -a`)로 만들 것. `git tag`가 만드는 lightweight 태그는
  `git push --follow-tags`가 무시하므로 push 출력에 아무 경고 없이 원격에서 누락된다
  (2.0.1, 2.2.0이 이렇게 빠졌다). 이미 lightweight로 만들었다면
  `git push origin '@jocoding-ax-partners/design-system@<version>'`로 명시 push
- 태그명에 `@`가 있어 셸에서 따옴표로 감쌀 것
- 태그 범위에 포함할 커밋이 추가되면 태그를 최신 커밋으로 이동 후 force push

### 빌드
- PostCSS로 `src/styles/index.css` → `dist/styles/index.css` 빌드
- `@jocoding-ax-partners/tailwind/styles`와 로컬 CSS는 인라인, `@heroui/styles`는 유지
- 배포물은 완성된 CSS가 아닌 Tailwind v4 소스 파일 (소비자 쪽에서 Tailwind 빌드 필요)
