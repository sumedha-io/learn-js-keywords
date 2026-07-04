const fs = require("fs");
const { execSync } = require("child_process");

let message = "";

try {
  if (!fs.existsSync("variables.js")) {
    message = `### 🤖 Welcome!

❌ **Step 1: Create \`variables.js\`**

Create a file named \`variables.js\` and declare:

\`\`\`javascript
const birthYear = 2006;
\`\`\`

Commit and push your changes.`;
  } else {
    const content = fs.readFileSync("variables.js", "utf8");

    // STEP 1
    if (
      !content.includes("const birthYear") ||
      content.includes("let birthYear") ||
      content.includes("var birthYear")
    ) {
      message = `### 🤖 Step 1 Feedback

❌ Declare a variable named **birthYear** using **const**.

Example:

\`\`\`javascript
const birthYear = 2006;
\`\`\``;
    }

    // STEP 2
    else if (
      !content.includes("let score") ||
      !content.includes("console.log(score)")
    ) {
      message = `### 🎉 Step 1 Passed!

Great! You used **const** correctly.

## 📝 Step 2

Now add this code to **variables.js**

\`\`\`javascript
if (true) {
    let score = 10;
}

console.log(score);
\`\`\`

Commit and push again.`;
    }

    // STEP 3
    else {
      try {
        execSync("node variables.js", { stdio: "pipe" });

        message = `### 🤖 Step 2 Feedback

❌ Your program ran successfully.

It should throw

\`\`\`
ReferenceError: score is not defined
\`\`\`

Make sure **console.log(score)** is outside the braces.`;
      } catch (error) {
        const output =
          (error.stderr?.toString() || "") +
          (error.stdout?.toString() || "") +
          (error.message || "");

        if (output.includes("ReferenceError")) {
          message = `### 🎉 Step 2 Passed!

Excellent!

You learned that **let** is block scoped.

## 📝 Final Step

Delete

\`\`\`javascript
console.log(score);
\`\`\`

so the file executes without errors.

Commit and push one last time.`;
        } else {
          message = `### 🤖 Step 2 Feedback

Your code crashed for a different reason.

Check your syntax and try again.`;
        }
      }

      // COURSE COMPLETE
      if (!content.includes("console.log(score)")) {
        try {
          execSync("node variables.js", { stdio: "pipe" });

          message = `# 🏆 Congratulations!

You have successfully completed the JavaScript Variables mini-course!

✅ const

✅ let

✅ Block Scope

Keep learning JavaScript! 🚀`;
        } catch {}
      }
    }
  }

  const summary = process.env.GITHUB_STEP_SUMMARY;

  if (summary) {
    fs.appendFileSync(summary, message + "\n");
  } else {
    console.log(message);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
