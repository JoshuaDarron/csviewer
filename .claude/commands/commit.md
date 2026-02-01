# Git Commit Command

## Before Committing

Review changes carefully. This project has no build step, tests, or linter — verify changes manually by reloading the extension in `chrome://extensions/`.

## Commit Workflow

### 1. Check Status
```bash
git status
git diff
```

### 2. Stage Files
```bash
# Stage specific files (preferred)
git add assets/js/viewer.js
git add assets/css/viewer.css

# Stage all (use sparingly)
git add -A
```

### 3. Create Commit
```bash
git commit -m "Add feature description"
```

## Commit Message Format

### Structure
```
<type>: <short description>

[optional body with more details]
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependencies |
| `style` | Formatting, whitespace (no code change) |

### Examples
```bash
# Feature
git commit -m "feat: Add column sorting to CSV viewer"

# Bug fix
git commit -m "fix: Resolve delimiter detection for tab-separated files"

# Refactor
git commit -m "refactor: Extract pagination logic from CSVEditor"

# Multiple lines
git commit -m "feat: Add drag-and-drop file import

- Support dropping CSV files onto the viewer
- Show visual drop zone indicator
- Validate file size before processing"
```

## Common Scenarios

### Amend Last Commit (unpushed only)
```bash
git add <files>
git commit --amend -m "Updated commit message"
```

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### View Commit History
```bash
git log --oneline -10
git log --oneline --all --graph
```

### Stash Changes
```bash
git stash
git stash pop
git stash list
```

## Branch Workflow

### Create Feature Branch
```bash
git checkout -b feature/add-column-sorting
git checkout -b fix/csv-parsing-bug
```

### Push Branch
```bash
git push -u origin feature/add-column-sorting
```

### Merge to Main
```bash
git checkout main
git pull origin main
git merge feature/add-column-sorting
git push origin main
```

## Files to Never Commit

- `.env` files (contain secrets)
- `node_modules/`
- `.DS_Store`, `Thumbs.db`
- IDE config (`.idea/`, `.vscode/` unless shared)

Verify with `git status` before committing.
