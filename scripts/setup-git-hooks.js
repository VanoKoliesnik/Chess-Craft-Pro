const fs = require("fs");
const path = require("path");

const hooksDir = path.join(process.cwd(), ".git", "hooks");

const preCommitHook = `#!/bin/sh
npx lint-staged
git add .
`;

const commitMsgHook = `#!/bin/sh
commit_msg_file=$1
commit_msg=$(cat $commit_msg_file)

# Define regex pattern for conventional commits
conventional_commit_regex="^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert|release)(\\(.+\\))?: .{1,}"

if ! echo "$commit_msg" | grep -qE "$conventional_commit_regex"; then
  echo "Invalid commit message format. Please use the conventional commit format."
  exit 1
fi
`;

fs.writeFileSync(path.join(hooksDir, "pre-commit"), preCommitHook);
fs.chmodSync(path.join(hooksDir, "pre-commit"), 0o755);

fs.writeFileSync(path.join(hooksDir, "commit-msg"), commitMsgHook);
fs.chmodSync(path.join(hooksDir, "commit-msg"), 0o755);

console.log("Git hooks have been set up successfully.");
