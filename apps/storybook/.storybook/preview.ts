import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import MockDate from "mockdate";

import "./index.css";
import "./docs.css";

// Chromatic 빌드에서는 "오늘"을 고정한다. Calendar·RangeCalendar 등은 `today()` 로
// 그리므로 날짜가 바뀌면 코드 변경 없이도 시각 변경으로 잡힌다. 영구 플레이크는 검토자를
// Accept 반사로 훈련시켜 게이트를 무력화한다(time-field.stories.tsx 의 Disabled 참고).
// 판별 조건은 chromatic/isChromatic 과 같다. 로컬 확인은 URL 에 `chromatic=true` 를 붙인다.
if (/Chromatic/.test(navigator.userAgent) || /chromatic=true/.test(location.href)) {
  MockDate.set("2026-01-15T12:00:00Z");
}

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
  parameters: {
    options: {
      storySort: { order: ["Foundations", "Components"] },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
