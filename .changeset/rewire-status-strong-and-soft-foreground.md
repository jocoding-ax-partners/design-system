---
"@jocoding-ax-partners/design-system": major
---

라이트 모드 상태색을 읽히는 값으로 재연결 — `--*-strong` · `--*-soft-foreground`

**소비자 화면이 바뀐다.** axhub-frontend 기준 **122곳**(자유 텍스트 89곳 + `variant="soft"` 33곳).
값만 바뀌므로 코드 수정은 필요 없지만, 바뀌는 것은 사람이 보는 색이다.

## 무엇이 고장이었나

정본의 상태색은 **다크에는 진짜 값이 있고 라이트에는 별칭만 있었다.** 라이트에서
`--danger-strong` 은 `--danger` 로, `--success-strong` 은 `--success` 로 풀렸고,
`--warning-strong` 은 `#f4ab00` 이었다. `-soft-foreground` 도 같은 모양으로 브랜드
원색을 그대로 썼다. 그 결과 라이트에서 잰 대비:

| | 값 | 대비 | |
| --- | --- | --- | --- |
| `--danger-strong` | `#ef1026` | 4.40 : 1 | AA 미달 |
| `--success-strong` | `#1fa24e` | 3.31 : 1 | AA 미달 |
| `--warning-strong` | `#f4ab00` | **1.97 : 1** | AA 미달 |
| `--warning-soft-foreground` | `#f4ab00` on `--warning-soft` | **1.82 : 1** | AA 미달 |

## 무엇으로 바뀌나

| 토큰 | 전 | 후 | 후 대비 |
| --- | --- | --- | --- |
| `--danger-strong` | `var(--danger)` | `var(--color-danger-700)` | 5.71 / 5.51 |
| `--success-strong` | `var(--success)` | `var(--color-success-700)` | 5.02 / 4.84 |
| `--warning-strong` | `#f4ab00` | `var(--color-warning-700)` | 5.02 / 4.85 |
| `--accent-soft-foreground` | `var(--accent)` | `var(--color-accent-800)` | 7.97 / 7.71 |
| `--danger-soft-foreground` | `var(--danger)` | `var(--color-danger-800)` | 6.20 / 6.00 |
| `--success-soft-foreground` | `var(--success)` | `var(--color-success-800)` | 6.25 / 6.05 |
| `--warning-soft-foreground` | `var(--warning-strong)` | `var(--color-warning-800)` | 6.49 / 6.29 |
| `--info-soft-foreground` | `var(--info)` | `var(--info-strong)` | 4.87 / 4.72 |

대비 두 값은 각각 `#fff`(`--bg-content`)·`#fafbfc`(`--bg-surface`) 기준이다.
`-soft-foreground` 는 브랜드색 15% 를 그 표면에 합성한 실제 배경 위에서 쟀다.
`--info-strong` 은 원래부터 진짜 값(`#0f5fcc`)이라 그대로 두고 재사용했다.

**다크는 건드리지 않는다.** 다크 블록은 처음부터 재-밝게 한 값을 갖고 있고 AA 를 넘는다.
라이트만의 고장이었다.

**warning 은 색상이 앰버로 옮겨진다.** 4.5:1 을 넘는 노랑은 없다 — 밝다는 것이 노랑의
정의이기 때문이다.

## 왜 minor 가 아닌가

diff 는 8줄이지만 semver 는 diff 크기가 아니라 **약속**이다. minor 는 "화면이 안 바뀐다"는
약속이고, 이 변경은 실서비스 122곳의 색을 바꾼다. 소비자가 값을 보고 릴리스를 고를 수
있어야 하므로 major 로 낸다.
