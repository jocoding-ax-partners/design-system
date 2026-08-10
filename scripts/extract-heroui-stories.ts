import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_URL = "https://github.com/heroui-inc/heroui.git";
const COMPONENTS_PATH = "packages/react/src/components";
const COMPONENTS_GROUP = "Components";
const STORYBOOK_APP = join(import.meta.dirname, "../apps/storybook");
const OUTPUT_DIR = join(STORYBOOK_APP, "src/stories");

// Extract from the tag matching the installed @heroui/react, not the v3 branch head.
// The branch moves ahead of the published package, so its stories reference APIs that
// don't exist in what we actually depend on.
function installedTag(): string {
  const require = createRequire(join(STORYBOOK_APP, "package.json"));
  const { version } = require("@heroui/react/package.json") as { version: string };

  return `v${version}`;
}

function replaceRelativeImports(content: string): string {
  // Replace all relative imports (./index, ./, ../, ../component-name, ./toast-queue, etc.) with @heroui/react
  return content
    .replace(
      /from\s+["'](\.\.?(?:\/[^"']*)?)["']/g,
      'from "@heroui/react"',
    )
    .replace(
      /from\s+["']@storybook\/react["']/g,
      'from "@storybook/react-vite"',
    )
    .replace(
      // Also matches the `import React, {useState} from "react"` form, which is what most
      // stories use — dropping only the default binding and keeping the named ones.
      /^import React(?:,\s*(\{[^}]*\}))?\s+from\s*["']react["'];?\n?/gm,
      (match, named: string | undefined) => {
        const withoutImport = content.replace(match, "");
        if (/\bReact\.\w+/.test(withoutImport)) return match;

        return named ? `import ${named} from "react";\n` : "";
      },
    );
}

function extractTitle(content: string): string {
  const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
  if (!titleMatch) return content;

  const fullTitle = titleMatch[1];
  // Drop HeroUI's own grouping and re-file everything under one sidebar section,
  // so token docs (Foundations/*) stay separate from the component list.
  const title = `${COMPONENTS_GROUP}/${fullTitle.split("/").pop()!}`;

  return content.replace(
    `title: "${fullTitle}"`,
    `title: "${title}"`,
  ).replace(
    `title: '${fullTitle}'`,
    `title: '${title}'`,
  );
}

function main() {
  const tag = installedTag();
  const tmpDir = mkdtempSync(join(tmpdir(), "heroui-"));

  console.log(`Cloning HeroUI (${tag}) into ${tmpDir}...`);
  execSync(`git clone --depth 1 --branch ${tag} ${REPO_URL} ${tmpDir}`, {
    stdio: "inherit",
  });

  const componentsDir = join(tmpDir, COMPONENTS_PATH);
  if (!existsSync(componentsDir)) {
    console.error(`Components directory not found: ${componentsDir}`);
    rmSync(tmpDir, { recursive: true, force: true });
    process.exit(1);
  }

  console.log(`Cleaning existing stories...`);
  for (const file of readdirSync(OUTPUT_DIR)) {
    if (file.endsWith(".stories.tsx")) {
      rmSync(join(OUTPUT_DIR, file));
    }
  }

  const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let copied = 0;

  for (const dir of componentDirs) {
    const storyFile = join(componentsDir, dir, `${dir}.stories.tsx`);
    if (!existsSync(storyFile)) continue;

    let content = readFileSync(storyFile, "utf-8");
    content = replaceRelativeImports(content);
    content = extractTitle(content);

    const outputFile = join(OUTPUT_DIR, `${dir}.stories.tsx`);
    writeFileSync(outputFile, content, "utf-8");
    copied++;
    console.log(`  Extracted: ${dir}.stories.tsx`);
  }

  console.log(`\nCleaning up temp directory...`);
  rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\nDone! Extracted ${copied} story files to ${OUTPUT_DIR}`);
}

main();
