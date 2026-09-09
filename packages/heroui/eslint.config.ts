import baseConfig from "@nijesmik/eslint-config";

import iconConfig from "../../eslint.icons.js";

// 아이콘 단일 세트 강제는 레포 전체 규칙이다(루트 `eslint.icons.js`). 이 패키지에는
// 지금 아이콘을 import 하는 파일이 없지만, 규칙이 여기에도 걸려 있어야 "이 패키지만
// 검사 밖" 이라는 구멍이 안 생긴다.
export default [...baseConfig, ...iconConfig];
