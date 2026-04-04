---
description: Automatically commits all changes to GitHub using Conventional Commits and casual explanations
---

# Casual Commit Workflow

This workflow automates committing changes to the repository. The AI will:
1. Check what files have been changed using `git status` and/or `git diff`.
2. Format a commit message using **Conventional Commits** (e.g., `feat:`, `fix:`, `chore:`).
3. Add a casual, user-friendly description to the commit body detailing *why* and *how* things were changed.
4. Stage all changes (`git add .`) and commit them (`git commit -m "..."`).

// turbo-all

1. Run `git status` to see what is modified.
2. Formulate the commit message following the format:
   ```
   <type>: <short description>
   
   <Casual, conversational explanation of the work done, focusing on value and bug fixes. For Example: "Fixed an issue, that if you edited the description of a staff member, that it put you after each character at the end of the text.">
   ```
3. Run the commit command: `git commit -am "<Commit Message here>"`
4. Run `git push` to attempt pushing to the remote repository.