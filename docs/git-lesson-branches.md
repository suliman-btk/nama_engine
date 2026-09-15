# Git workflow for lesson branches

The repository has a shared rendering engine and multiple independent lessons.
Use one long-lived branch per lesson while keeping reusable engine development
integrated on `main`.

## Branch naming

| Purpose | Canonical branch |
| --- | --- |
| Shared engine and templates | `main` |
| Lesson 1 | `lesson/lesson-01` |
| Lesson 2 | `lesson/lesson-02` |
| Any later lesson | `lesson/lesson-XX` |

Do not invent variants such as `lesson1`, `lesson-1`, or `video-01` when the
canonical name can be used.

## Mandatory approval gate

An agent must not create or switch branches silently. Before running a mutating
Git command, it must report:

1. the current branch;
2. whether the working tree contains uncommitted files;
3. the exact proposed branch name;
4. the exact base branch or commit;
5. how existing changes will be preserved; and
6. that it is waiting for the user's approval.

Only an explicit reply approving that proposal unlocks the operation. Approval
for one branch does not authorize creating other lesson branches.

Example notice:

> I am currently on `main`, and the working tree is clean. For Lesson 2, I
> propose creating `lesson/lesson-02` from `main` and switching to it. No other
> branch will be changed. Shall I proceed?

If the tree is dirty, do not switch, stash, reset, commit, or move the changes
without a separate preservation plan approved by the user.

## Understanding work on another branch

This is a multi-branch repository. Before designing a lesson, an agent may use
read-only inspection to understand established engine usage on another lesson
branch:

```bash
git branch --all
git log --oneline --decorate --all
git ls-tree -r --name-only lesson/lesson-01 -- lessons/lesson-01
git show lesson/lesson-01:lessons/lesson-01/input/scene-config.json
git diff main...lesson/lesson-01 -- production/remotion-engine
```

Prefer these commands over checking out the reference branch. Never copy a
lesson-number condition or other lesson-specific workaround into the reusable
engine. Extract reusable behavior into data or shared components.

## Shared engine changes

Lesson branches may consume the shared engine. If lesson work reveals a reusable
engine fix, keep that change logically separate and tell the user it should be
integrated into `main`. Merging, rebasing, or cherry-picking still requires an
explicit proposal and approval.

## Safe sequence for a lesson

1. Inspect repository status and available branches.
2. Propose the exact lesson branch and base.
3. Wait for explicit user approval.
4. Create or switch to only the approved branch.
5. Confirm the active branch before editing lesson files.
6. Run the normal lesson preparation, picture-review approval, render, and QA
   workflow documented in `agent-workflow.md`.
