/**
 * Fails the build if any emitted file imports a relative path without a file
 * extension.
 *
 * This package is `"type": "module"`, so Node's ESM resolver requires an
 * explicit extension on every relative specifier. TypeScript emits specifiers
 * verbatim and `moduleResolution: "bundler"` happily accepts extension-less
 * ones, so nothing in the compiler stops us from publishing output that no
 * Node consumer (Vitest, Jest, SSR) can import. `0.1.0` shipped exactly that:
 *
 *     export { cn } from "./lib/cn";
 *     → ERR_MODULE_NOT_FOUND
 *
 * We check the emitted artifact rather than the source because the artifact is
 * what broke, and because this stays correct no matter how tsconfig changes
 * later. `moduleResolution: "nodenext"` would make the compiler enforce this
 * instead, but it also applies node16 resolution to our dependencies' shipped
 * `.d.ts` files — `@heroui/react` and `@phosphor-icons/react` both use
 * extension-less specifiers there, which breaks type-checking for reasons that
 * are not ours to fix.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = join(fileURLToPath(new URL("..", import.meta.url)), "dist");

/** `from './x'` / `import('./x')` — captures the specifier. */
const SPECIFIER = /(?:from\s*|import\s*\(\s*)['"](\.[^'"]*)['"]/g;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(js|d\.ts)$/.test(entry) ? [path] : [];
  });
}

const offenders = [];

for (const file of walk(distDir)) {
  const source = readFileSync(file, "utf8");
  for (const [, specifier] of source.matchAll(SPECIFIER)) {
    if (!/\.[a-z]+$/i.test(specifier)) {
      offenders.push(`${relative(distDir, file)}: ${specifier}`);
    }
  }
}

if (offenders.length > 0) {
  console.error(
    `\nRelative imports without a file extension in dist/ (${offenders.length}).\n` +
      `Node's ESM resolver rejects these, so the published package would fail to\n` +
      `import. Add the ".js" extension at the source import site.\n`,
  );
  for (const offender of offenders) console.error(`  ${offender}`);
  console.error("");
  process.exit(1);
}

console.log(`ESM extensions OK — checked ${walk(distDir).length} emitted files.`);
