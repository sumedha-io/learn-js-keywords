const fs = require('fs');
const { execSync } = require('child_process');

// 1. Read the student's current step
const config = JSON.parse(fs.readFileSync('.github/config.json', 'utf8'));
const step = config.currentStep;

let success = false;
let message = "";
let nextStepInstructions = "";

try {
  // --- LESSON 1 RULES ---
  if (step === 1) {
    if (fs.existsSync('variables.js')) {
      const content = fs.readFileSync('variables.js', 'utf8');
      
      // Check if they correctly used const for birthYear
      if (content.includes('const birthYear') && !content.includes('let birthYear') && !content.includes('var birthYear')) {
        success = true;
        message = "### 🤖 Bot Review: Step 1 Passed!\n\n🎉 **Excellent!** You correctly used `const` for a value that should never change.\n\nNow let's move to the next topic.";
        nextStepInstructions = "### 📝 Step 2: Block Scoping with `let`\n\nInside your `variables.js` file, add an `if` block like this:\n```javascript\nif (true) {\n  let score = 10;\n}\nconsole.log(score);\n```\nPush your code when you are ready, and let's see what happens!";
        config.currentStep = 2;
      } else {
        message = "### 🤖 Bot Review: Step 1 Feedback\n\n❌ **Oops!** Make sure you declared a variable named `birthYear` using the exact `const` keyword inside `variables.js`.";
      }
    } else {
      message = "### 🤖 Bot Review: Step 1 Feedback\n\n❌ **File not found!** Please create a brand new file named `variables.js` in the root folder of your repository.";
    }
  } 
  
  // --- LESSON 2 RULES ---
  else if (step === 2) {
    if (fs.existsSync('variables.js')) {
      // Run the student's code to see if it properly crashes due to block scoping
      try {
        execSync('node variables.js', { stdio: 'pipe' });
        message = "### 🤖 Bot Review: Step 2 Feedback\n\n❌ Your code ran successfully, which means `score` leaked outside its block scope! Ensure `let score = 10;` is *inside* the `if (true) { ... }` curly braces, and `console.log(score);` is *outside* of them.";
      } catch (error) {
        if (error.message.includes('ReferenceError: score is not defined')) {
          success = true;
          message = "### 🤖 Bot Review: Step 2 Passed!\n\n🎉 **Brilliant!** You just witnessed block-scoping. Variables declared with `let` cannot be accessed outside the `{}` block they were made in. This prevents bugs!";
          nextStepInstructions = "### 📝 Step 3: Complete the Course\n\nYou've mastered `const` and `let`! Delete the error-causing `console.log(score)` line so your script runs smoothly, then push your final code.";
          config.currentStep = 3;
        } else {
          message = "### 🤖 Bot Review: Step 2 Feedback\n\n❌ Your code crashed, but not with the expected block-scope error. Ensure you are logging `score` outside the block.";
        }
      }
    }
  }

  // --- COURSE COMPLETE ---
  else {
    message = "### 🤖 Bot Review: Course Complete!\n\n🏆 **Congratulations!** You have completed the JavaScript keywords introduction course!";
  }

  // 2. Save progress if they passed
if (success) {
  fs.writeFileSync('.github/config.json', JSON.stringify(config, null, 2));
  message += `\n\n${nextStepInstructions}`;
}

// 3. Publish feedback to the GitHub Actions job summary
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

if (summaryPath) {
  fs.appendFileSync(summaryPath, `${message}\n\n---\n`);
} else {
  console.log(message);
}

} catch (error) {
  console.error(error);
  process.exit(1);
}
