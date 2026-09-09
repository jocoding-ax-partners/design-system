// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfig from "@nijesmik/eslint-config";

// 아이콘 단일 세트 강제는 레포 전체 규칙이다(루트 `eslint.icons.js`). 이 컴포넌트들을
// 실제로 전시하는 표면이라 여기에 규칙이 없으면 데모에서 다른 아이콘 세트가 새어든다.
import iconConfig from "../../eslint.icons.js";

export default defineConfig([
  ...eslintConfig,
  globalIgnores(["storybook-static", "src/stories/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...storybook.configs["flat/recommended"],
  ...iconConfig,
]);
