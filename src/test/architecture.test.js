// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
it("resolves all relative imports with exact casing on Windows and Linux", () => {
  const root = path.resolve("src");
  const files = fs
    .readdirSync(root, { recursive: true })
    .filter((file) => /\.(js|jsx|css)$/.test(file));
  const known = new Set(files.map((file) => path.resolve(root, file)));
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    const imports = source.matchAll(
      /(?:from\s*|import\s*\(?|@import\s*)["'](\.[^"']+)["']/g,
    );
    for (const [, specifier] of imports) {
      const target = path.resolve(root, path.dirname(file), specifier);
      expect(known.has(target), file + " imports " + specifier).toBe(true);
    }
  }
});
