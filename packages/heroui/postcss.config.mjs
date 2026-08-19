import { createRequire } from "node:module";
import postcssImport from "postcss-import";

const require = createRequire(import.meta.url);

export default {
  plugins: [
    postcssImport({
      filter: (path) =>
        path.startsWith(".") ||
        path.startsWith("..") ||
        path.includes("@jocoding-ax-partners/tailwind"),
      resolve: (id) => {
        if (id === "@jocoding-ax-partners/tailwind/styles") {
          return require.resolve("@jocoding-ax-partners/tailwind/styles");
        }
        return id;
      },
    }),
  ],
};
