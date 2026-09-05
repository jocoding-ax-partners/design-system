---
"@jocoding-ax-partners/react": patch
---

SearchBox 포커스 링을 1px 로 맞춘다.

HeroUI `SearchField.Group` 의 기본 포커스 링은 2px 이고 링 폭 토큰이 없다
(`heroui.min.css` 에 하드코딩). axhub-frontend 가 이 패키지로 이관하기 전
로컬 래퍼에서 `focus-within:ring-1` 로 덮고 있던 값이라, 정본을 여기로 옮긴다.
소비자는 래퍼 없이 패키지 컴포넌트를 그대로 쓸 수 있다.
