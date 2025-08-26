import { execSync } from "child_process";

try {
  execSync("npx eslint . --fix", { stdio: "inherit" });
} catch {
  // ignore lint errors
}

execSync("git diff > autofix.patch");
