import { createRequire } from "node:module";
import postcssImport from "postcss-import";

const require = createRequire(import.meta.url);

export default {
  plugins: [
    postcssImport({
      filter: (path) =>
        path.startsWith(".") || path.startsWith("..") || path.includes("@demodev-ui/core"),
      resolve: (id) => {
        if (id === "@demodev-ui/core/styles") {
          return require.resolve("@demodev-ui/core/styles");
        }
        return id;
      },
    }),
  ],
};
