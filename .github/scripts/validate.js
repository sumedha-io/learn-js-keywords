const fs = require("fs");
const { execSync } = require("child_process");

let message = "";

try {
    if (!fs.existsSync("variables.js")) {
        message = `### 🤖 Step 1

❌ **variables.js not found**

Create a file named **variables.js** in the root of your repository.

Inside it write:

\`\`\`javascript
const birthYear = 2006;
\`\`\`
`;
    } else {
        const content = fs.readFileSync("variables.js", "utf8");

        // STEP 1
        if (
            !content.includes("const birthYear") ||
            content.includes("let birthYear") ||
            content.includes("var birthYear")
        ) {
            message = `### 🤖 Step 1 Feedback

❌ Declare **birthYear** using **const**.

Example:

\`\`\`javascript
const birthYear = 2006;
\`\`\`
`;
        }

        // STEP 2 NOT STARTED
        else if (
            !content.includes("let score") ||
            !content.includes("console.log(score)")
        ) {
            message = `### 🎉 Step 1 Passed!

Great job using **const**.

---

## 📝 Step 2

Now add this code below your first variable.

\`\`\`javascript
if (true) {
    let score = 10;
}

console.log(score);
\`\`\`

Commit and push your changes.`;
        }

        // STEP 2
        else {
            try {
                execSync("node variables.js", {
                    stdio: "pipe"
                });

                message = `### 🤖 Step 2 Feedback

❌ Your program ran successfully.

It should produce a **ReferenceError**.

Make sure

- \`let score\` is INSIDE the if block.
- \`console.log(score)\` is OUTSIDE the block.
`;
            } catch (error) {

                const output =
                    (error.stderr?.toString() || "") +
                    (error.stdout?.toString() || "") +
                    (error.message || "");

                if (output.includes("ReferenceError")) {

                    message = `### 🎉 Step 2 Passed!

Excellent!

You have just learned that **let is block scoped.**

---

## 📝 Final Step

Delete

\`\`\`javascript
console.log(score);
\`\`\`

Run the file again.

When there are no errors, push your code.`;

                } else {

                    message = `### 🤖 Step 2 Feedback

❌ Your code crashed for another reason.

Expected:

ReferenceError: score is not defined
`;
                }
            }

            // COURSE COMPLETE
            if (
                !content.includes("console.log(score)") &&
                content.includes("let score")
            ) {

                try {
                    execSync("node variables.js", {
                        stdio: "pipe"
                    });

                    message = `# 🏆 Congratulations!

You completed the JavaScript Scope Course.

You learned:

- ✅ const
- ✅ let
- ✅ Block Scope

Excellent work! 🎉`;

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
