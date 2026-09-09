import { test } from "node:test";
import assert from "node:assert/strict";
import { Linter } from "eslint";

import { iconRule } from "../../../eslint.icons.js";

/*
 * Guard for the repo-wide "one icon set" rule (`eslint.icons.js`).
 *
 * Why it lives in this package: the rule is repo-wide, but this is the only
 * package with a plain-JS test runner, so a test here can import the config
 * file directly without a TypeScript declaration for it.
 *
 * What it measures: ESLint's real `no-restricted-imports` matcher, fed the real
 * rule options — not a copy of the regex. The previous version of this rule was
 * a five-name denylist, and `@tabler/icons-react` and `feather-icons` walked
 * straight through it. Two of the assertions below are exactly those two names.
 *
 * It also pins the two false positives the first allowlist attempt produced:
 * `group` (glob) patterns are matched with gitignore semantics, under which a
 * child cannot be re-included once its parent directory is excluded — so
 * `"*icon*"` + `"!@phosphor-icons/react"` blocked Phosphor itself, and `"*icon*"`
 * matching at any path depth blocked the internal `./lib/icon.js`.
 */
const linter = new Linter();

function messagesFor(specifier) {
  return linter.verify(`import x from "${specifier}";\n`, {
    rules: { "no-restricted-imports": iconRule },
  });
}

const ALLOWED = [
  "@phosphor-icons/react",
  "@phosphor-icons/react/dist/ssr",
  "./lib/icon.js",
  "../lib/icon.js",
  "clsx",
  "@heroui/react",
  "react",
];

const BLOCKED = [
  // the five the old denylist named
  "lucide-react",
  "@iconify/react",
  "react-icons",
  "@radix-ui/react-icons",
  "@heroicons/react/24/solid",
  // the two that walked through it
  "@tabler/icons-react",
  "feather-icons",
  // subpaths of the above
  "lucide-react/icons/x",
  "react-icons/fi",
];

for (const specifier of ALLOWED) {
  test(`icon rule allows ${specifier}`, () => {
    assert.deepEqual(
      messagesFor(specifier).map((m) => m.message),
      [],
    );
  });
}

for (const specifier of BLOCKED) {
  test(`icon rule blocks ${specifier}`, () => {
    const messages = messagesFor(specifier);
    assert.equal(messages.length, 1, `expected exactly one report for ${specifier}`);
    assert.match(messages[0].message, /@phosphor-icons\/react/);
  });
}
