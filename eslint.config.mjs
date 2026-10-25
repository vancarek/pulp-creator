// Extends the shared base from @maat-apps/config. Add repo-specific
// overrides after baseConfig.
import { baseConfig } from "@maat-apps/config/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...baseConfig,
  {
    // shadcn-generated primitives export their cva variants next to the
    // component, as generated.
    files: ["src/components/ui/**/*.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  globalIgnores([".claude/worktrees/**", "coverage/**"]),
]);
