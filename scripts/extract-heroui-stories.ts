import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_URL = "https://github.com/heroui-inc/heroui.git";
const BRANCH = "v3";
const COMPONENTS_PATH = "packages/react/src/components";
const OUTPUT_DIR = join(import.meta.dirname, "../apps/storybook/src/stories");

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
    .replace(/^import React(?:,\s*\{([^}]+)\})?\s*from\s*["']react["'];?\n?/gm, (_match, named) =>
      named ? `import {${named}} from "react";\n` : "",
    );
}

function extractTitle(content: string): string {
  const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
  if (!titleMatch) return content;

  const fullTitle = titleMatch[1];
  const lastSegment = fullTitle.split("/").pop()!;

  return content.replace(
    `title: "${fullTitle}"`,
    `title: "${lastSegment}"`,
  ).replace(
    `title: '${fullTitle}'`,
    `title: '${lastSegment}'`,
  );
}

function main() {
  const tmpDir = mkdtempSync(join(tmpdir(), "heroui-"));

  console.log(`Cloning HeroUI (${BRANCH}) into ${tmpDir}...`);
  execSync(`git clone --depth 1 --branch ${BRANCH} ${REPO_URL} ${tmpDir}`, {
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
